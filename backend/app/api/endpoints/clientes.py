from typing import List

from app.db.database import get_db
from app.models.cliente import Cliente
from app.schemas import cliente as schemas
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/clientes", tags=["clientes"])

@router.get("/", response_model=List[schemas.Cliente])
def read_clientes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Obtiene la lista de clientes"""
    clientes = db.query(Cliente).offset(skip).limit(limit).all()
    return clientes

@router.get("/{numero_cuenta}", response_model=schemas.Cliente)
def read_cliente(
    numero_cuenta: str,
    db: Session = Depends(get_db)
):
    """Obtiene un cliente por su número de cuenta"""
    cliente = db.query(Cliente).filter(Cliente.numero_cuenta == numero_cuenta).first()
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.post("/", response_model=schemas.Cliente)
def create_cliente(
    cliente: schemas.ClienteCreate,
    db: Session = Depends(get_db)
):
    """Crea un nuevo cliente"""
    db_cliente = db.query(Cliente).filter(Cliente.numero_cuenta == cliente.numero_cuenta).first()
    if db_cliente:
        raise HTTPException(status_code=400, detail="Número de cuenta ya registrado")
    
    nuevo_cliente = Cliente(**cliente.dict())
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente