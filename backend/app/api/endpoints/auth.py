from collections import defaultdict
from datetime import datetime, timedelta, timezone
from threading import Lock

from app.api.dependencies import get_current_user
from app.api.tenant import get_tenant_id
from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.db.database import get_db
from app.models.user import User
from app.schemas import user as schemas
from app.schemas.token import Token
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])

_FAILED_LOGIN_ATTEMPTS: dict[str, list[datetime]] = defaultdict(list)
_FAILED_LOGIN_ATTEMPTS_LOCK = Lock()


def _attempt_key(tenant_id: str, username: str) -> str:
    return f"{tenant_id}:{username.strip().lower()}"


def _cleanup_attempts(attempts: list[datetime], now: datetime) -> list[datetime]:
    window = timedelta(minutes=settings.AUTH_LOCKOUT_MINUTES)
    threshold = now - window
    return [value for value in attempts if value >= threshold]


def _register_failed_attempt(key: str) -> None:
    now = datetime.now(timezone.utc)
    with _FAILED_LOGIN_ATTEMPTS_LOCK:
        _FAILED_LOGIN_ATTEMPTS[key] = _cleanup_attempts(_FAILED_LOGIN_ATTEMPTS[key], now)
        _FAILED_LOGIN_ATTEMPTS[key].append(now)


def _clear_failed_attempts(key: str) -> None:
    with _FAILED_LOGIN_ATTEMPTS_LOCK:
        _FAILED_LOGIN_ATTEMPTS.pop(key, None)


def _get_lockout_remaining_seconds(key: str) -> int:
    now = datetime.now(timezone.utc)
    with _FAILED_LOGIN_ATTEMPTS_LOCK:
        attempts = _cleanup_attempts(_FAILED_LOGIN_ATTEMPTS[key], now)
        if not attempts:
            _FAILED_LOGIN_ATTEMPTS.pop(key, None)
            return 0
        _FAILED_LOGIN_ATTEMPTS[key] = attempts
        if len(attempts) < settings.AUTH_MAX_FAILED_ATTEMPTS:
            return 0

        oldest_relevant = attempts[0]
        window_end = oldest_relevant + timedelta(minutes=settings.AUTH_LOCKOUT_MINUTES)
        return max(int((window_end - now).total_seconds()), 1)


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
):
    """
    Obtiene un token de acceso usando credenciales de usuario
    """
    normalized_username = form_data.username.strip().lower()
    attempt_key = _attempt_key(tenant_id=tenant_id, username=normalized_username)
    lockout_remaining_seconds = _get_lockout_remaining_seconds(attempt_key)
    if lockout_remaining_seconds > 0:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=(
                "Demasiados intentos de autenticación fallidos. "
                f"Intenta de nuevo en {lockout_remaining_seconds} segundos."
            ),
        )

    user = (
        db.query(User)
        .filter(User.email == normalized_username, User.tenant_id == tenant_id)
        .first()
    )
    if not user or not verify_password(form_data.password, user.hashed_password):
        _register_failed_attempt(attempt_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        _register_failed_attempt(attempt_key)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo",
        )

    _clear_failed_attempts(attempt_key)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id),
        tenant_id=user.tenant_id,
        expires_delta=access_token_expires,
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "is_admin": user.is_admin,
        "tenant_id": user.tenant_id,
    }
    
@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Obtiene información del usuario autenticado
    """
    return current_user