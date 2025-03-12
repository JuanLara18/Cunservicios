import random
import string
from datetime import datetime, timedelta
from typing import List, Optional

from app.db.database import get_db
from app.models.cliente import Cliente
from app.models.pqr import PQR, EstadoPQR, TipoPQR
from app.schemas import pqr as schemas
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/pqrs", tags=["pqrs"])

def generate_radicado():
    """Genera un número de radicado aleatorio para PQRs"""
    return f"PQR-{datetime.now().strftime('%Y%m%d')}-{''.join(random.choices(string.digits, k=4))}"

@router.get("/", response_model=List[schemas.PQR])
def read_pqrs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    cliente_id: Optional[int] = None,
    tipo: Optional[TipoPQR] = None,
    estado: Optional[EstadoPQR] = None
):
    """Obtiene la lista de PQRs, con filtros opcionales"""
    query = db.query(PQR)
    
    if cliente_id:
        query = query.filter(PQR.cliente_id == cliente_id)
    if tipo:
        query = query.filter(PQR.tipo == tipo)
    if estado:
        query = query.filter(PQR.estado == estado)
    
    pqrs = query.offset(skip).limit(limit).all()
    return pqrs

@router.get("/{radicado}", response_model=schemas.PQR)
def read_pqr(
    radicado: str,
    db: Session = Depends(get_db)
):
    """Obtiene un PQR por su número de radicado"""
    pqr = db.query(PQR).filter(PQR.radicado == radicado).first()
    if pqr is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="PQR no encontrado"
        )
    return pqr

@router.post("/", response_model=schemas.PQR, status_code=status.HTTP_201_CREATED)
def create_pqr(
    pqr: schemas.PQRCreate,
    db: Session = Depends(get_db)
):
    """Crea un nuevo PQR"""
    # Verificar que el cliente existe
    cliente = db.query(Cliente).filter(Cliente.id == pqr.cliente_id).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente no encontrado"
        )
    
    try:
        # Generar datos adicionales
        nuevo_pqr = PQR(
            **pqr.dict(),
            fecha_creacion=datetime.now().date(),
            estado=EstadoPQR.RECIBIDO,
            radicado=generate_radicado()
        )
        
        db.add(nuevo_pqr)
        db.commit()
        db.refresh(nuevo_pqr)
        return nuevo_pqr
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear PQR: {str(e)}"
        )

@router.patch("/{radicado}/estado", response_model=schemas.PQR)
def update_pqr_estado(
    radicado: str,
    estado: EstadoPQR,
    db: Session = Depends(get_db)
):
    """Actualiza el estado de un PQR"""
    pqr = db.query(PQR).filter(PQR.radicado == radicado).first()
    if pqr is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="PQR no encontrado"
        )
    
    pqr.estado = estado
    # Si el estado es RESPONDIDO o CERRADO, registrar fecha de respuesta
    if estado in [EstadoPQR.RESPONDIDO, EstadoPQR.CERRADO]:
        pqr.fecha_respuesta = datetime.now().date()
        
    db.commit()
    db.refresh(pqr)
    return pqr