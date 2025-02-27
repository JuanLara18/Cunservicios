
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas import user as schemas
from app.api import dependencies
from app.db.database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    # Lógica para obtener usuarios
    return []

@router.post("/", response_model=schemas.User)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    # Lógica para crear usuario
    return {}

