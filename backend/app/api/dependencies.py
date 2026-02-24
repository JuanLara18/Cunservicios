from app.api.tenant import get_tenant_id
from app.core.config import settings
from app.db.database import get_db
from app.models.user import User
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    tenant_id: str = Depends(get_tenant_id),
) -> User:
    """
    Valida el token JWT y devuelve el usuario actual
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        token_tenant: str | None = payload.get("tenant")
        token_type: str | None = payload.get("type")
        if user_id is None or token_tenant is None or token_type != "access":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    if token_tenant != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El token no pertenece al tenant solicitado",
        )

    try:
        parsed_user_id = int(user_id)
    except (TypeError, ValueError):
        raise credentials_exception

    effective_tenant = token_tenant
    user = (
        db.query(User)
        .filter(User.id == parsed_user_id, User.tenant_id == effective_tenant)
        .first()
    )
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo",
        )
    
    return user

def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verifica que el usuario actual sea administrador
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permiso denegado"
        )
    return current_user