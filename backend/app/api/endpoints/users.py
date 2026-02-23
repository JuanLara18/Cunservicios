from typing import List, Optional

from app.api.dependencies import get_admin_user, get_current_user
from app.core.security import get_password_hash, verify_password
from app.db.database import get_db
from app.models.user import User
from app.schemas import user as schemas
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    is_active: Optional[bool] = None,
    current_user: User = Depends(get_admin_user)  # Solo administradores
):
    """
    Obtiene la lista de usuarios.
    
    Solo accesible por administradores.
    
    Parámetros:
    - **skip**: Número de registros para saltar (paginación)
    - **limit**: Número máximo de registros a devolver
    - **is_active**: Filtrar por usuarios activos/inactivos
    """
    query = db.query(User).filter(User.tenant_id == current_user.tenant_id)
    
    # Aplicar filtros si están presentes
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    # Aplicar paginación
    users = query.offset(skip).limit(limit).all()
    return users

@router.get("/me", response_model=schemas.User)
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Obtiene información del usuario autenticado actualmente.
    """
    return current_user

@router.get("/{user_id}", response_model=schemas.User)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene un usuario específico por su ID.
    
    Los administradores pueden ver cualquier usuario.
    Los usuarios normales solo pueden ver su propia información.
    """
    # Verificar permisos
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para acceder a esta información"
        )
    
    # Buscar el usuario
    user = (
        db.query(User)
        .filter(User.id == user_id, User.tenant_id == current_user.tenant_id)
        .first()
    )
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return user

@router.post("/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)  # Solo administradores
):
    """
    Crea un nuevo usuario.
    
    Solo accesible por administradores.
    """
    # Verificar si el email ya está registrado
    db_user = (
        db.query(User)
        .filter(User.email == user.email, User.tenant_id == current_user.tenant_id)
        .first()
    )
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )
    
    try:
        # Crear el nuevo usuario
        hashed_password = get_password_hash(user.password)
        db_user = User(
            tenant_id=current_user.tenant_id,
            email=user.email,
            hashed_password=hashed_password,
            is_active=True,
            is_admin=False  # Por defecto, los nuevos usuarios no son administradores
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al crear el usuario, verifica los datos"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado: {str(e)}"
        )

@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Actualiza un usuario existente.
    
    Los administradores pueden actualizar cualquier usuario.
    Los usuarios normales solo pueden actualizar su propia información.
    """
    # Verificar permisos
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para modificar este usuario"
        )
    
    # Buscar el usuario
    db_user = (
        db.query(User)
        .filter(User.id == user_id, User.tenant_id == current_user.tenant_id)
        .first()
    )
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Actualizar email si está presente y es diferente
    if user_update.email is not None and user_update.email != db_user.email:
        # Verificar que el nuevo email no esté en uso
        existing_user = (
            db.query(User)
            .filter(
                User.email == user_update.email,
                User.tenant_id == current_user.tenant_id,
            )
            .first()
        )
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email ya registrado por otro usuario"
            )
        db_user.email = user_update.email
    
    # Actualizar contraseña si está presente
    if user_update.password:
        db_user.hashed_password = get_password_hash(user_update.password)
    
    # Actualizar estado activo (solo administradores)
    if current_user.is_admin and user_update.is_active is not None:
        db_user.is_active = user_update.is_active
    
    # Actualizar estado de administrador (solo administradores)
    if current_user.is_admin and user_update.is_admin is not None:
        # Un administrador no puede quitarse a sí mismo los permisos de administrador
        if current_user.id == user_id and not user_update.is_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes quitarte a ti mismo los permisos de administrador"
            )
        db_user.is_admin = user_update.is_admin
    
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al actualizar el usuario, verifica los datos"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado: {str(e)}"
        )

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)  # Solo administradores
):
    """
    Elimina un usuario.
    
    Solo accesible por administradores.
    Un administrador no puede eliminarse a sí mismo.
    """
    # Verificar que no se intente eliminar al propio usuario administrador
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminar tu propio usuario administrador"
        )
    
    # Buscar el usuario
    db_user = (
        db.query(User)
        .filter(User.id == user_id, User.tenant_id == current_user.tenant_id)
        .first()
    )
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    try:
        db.delete(db_user)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el usuario: {str(e)}"
        )

@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    password_data: schemas.PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cambia la contraseña del usuario autenticado.
    
    Requiere la contraseña actual para verificación.
    """
    # Verificar contraseña actual
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña actual incorrecta"
        )
    
    # Actualizar contraseña
    current_user.hashed_password = get_password_hash(password_data.new_password)
    
    try:
        db.commit()
        return {"message": "Contraseña actualizada correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al cambiar la contraseña: {str(e)}"
        )