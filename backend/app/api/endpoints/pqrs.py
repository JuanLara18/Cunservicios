import random
import string
from datetime import datetime
from typing import List, Optional

from app.api.dependencies import get_admin_user, get_current_user
from app.api.tenant import get_tenant_id
from app.db.database import get_db
from app.models.cliente import Cliente
from app.models.pqr import PQR, EstadoPQR, TipoPQR
from app.models.user import User
from app.schemas import pqr as schemas
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/pqrs",
    tags=["pqrs"],
    dependencies=[Depends(get_current_user)],
)

def generate_radicado(tenant_id: str) -> str:
    """Genera un número de radicado con prefijo de tenant."""
    tenant_prefix = tenant_id[:6].upper()
    return (
        f"{tenant_prefix}-PQR-{datetime.now().strftime('%Y%m%d')}-"
        f"{''.join(random.choices(string.digits, k=5))}"
    )

@router.get("/", response_model=List[schemas.PQR])
def read_pqrs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    cliente_id: Optional[int] = None,
    tipo: Optional[TipoPQR] = None,
    estado: Optional[EstadoPQR] = None,
    tenant_id: str = Depends(get_tenant_id),
):
    """Obtiene la lista de PQRs, con filtros opcionales"""
    query = db.query(PQR).filter(PQR.tenant_id == tenant_id)
    
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
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
):
    """Obtiene un PQR por su número de radicado"""
    pqr = (
        db.query(PQR)
        .filter(PQR.radicado == radicado, PQR.tenant_id == tenant_id)
        .first()
    )
    if pqr is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="PQR no encontrado"
        )
    return pqr

@router.post("/", response_model=schemas.PQR, status_code=status.HTTP_201_CREATED)
def create_pqr(
    pqr: schemas.PQRCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
):
    """Crea un nuevo PQR"""
    # Verificar que el cliente existe
    cliente = (
        db.query(Cliente)
        .filter(Cliente.id == pqr.cliente_id, Cliente.tenant_id == tenant_id)
        .first()
    )
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente no encontrado"
        )
    
    try:
        radicado = ""
        for _ in range(5):
            candidate = generate_radicado(tenant_id)
            exists = (
                db.query(PQR)
                .filter(PQR.tenant_id == tenant_id, PQR.radicado == candidate)
                .first()
            )
            if not exists:
                radicado = candidate
                break

        if not radicado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No fue posible generar un radicado único",
            )

        # Generar datos adicionales
        nuevo_pqr = PQR(
            **pqr.model_dump(),
            tenant_id=tenant_id,
            fecha_creacion=datetime.now().date(),
            estado=EstadoPQR.RECIBIDO,
            radicado=radicado,
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
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
    _: User = Depends(get_admin_user),
):
    """Actualiza el estado de un PQR"""
    pqr = (
        db.query(PQR)
        .filter(PQR.radicado == radicado, PQR.tenant_id == tenant_id)
        .first()
    )
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