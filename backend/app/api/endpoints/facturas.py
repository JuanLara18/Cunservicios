from typing import List, Optional

from app.api.dependencies import get_admin_user, get_current_user
from app.api.tenant import get_tenant_id
from app.db.database import get_db
from app.models.cliente import Cliente
from app.models.factura import Factura
from app.models.user import User
from app.schemas import factura as schemas
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/facturas",
    tags=["facturas"],
    dependencies=[Depends(get_current_user)],
)

@router.get("/", response_model=List[schemas.Factura])
def read_facturas(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    cliente_id: Optional[int] = None,
    tenant_id: str = Depends(get_tenant_id),
):
    """Obtiene la lista de facturas, opcionalmente filtrada por cliente"""
    query = db.query(Factura).filter(Factura.tenant_id == tenant_id)
    if cliente_id:
        query = query.filter(Factura.cliente_id == cliente_id)
    
    facturas = query.offset(skip).limit(limit).all()
    return facturas

@router.get("/{numero_factura}", response_model=schemas.Factura)
def read_factura(
    numero_factura: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
):
    """Obtiene una factura por su número"""
    factura = (
        db.query(Factura)
        .filter(Factura.numero_factura == numero_factura, Factura.tenant_id == tenant_id)
        .first()
    )
    if factura is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return factura

@router.get("/cliente/{numero_cuenta}", response_model=List[schemas.Factura])
def read_facturas_by_cliente(
    numero_cuenta: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
):
    """Obtiene las facturas de un cliente por su número de cuenta"""
    cliente = (
        db.query(Cliente)
        .filter(Cliente.numero_cuenta == numero_cuenta, Cliente.tenant_id == tenant_id)
        .first()
    )
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    facturas = (
        db.query(Factura)
        .filter(Factura.cliente_id == cliente.id, Factura.tenant_id == tenant_id)
        .all()
    )
    return facturas

@router.post("/", response_model=schemas.Factura)
def create_factura(
    factura: schemas.FacturaCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
    _: User = Depends(get_admin_user),
):
    """Crea una nueva factura"""
    # Verificar que el cliente existe
    cliente = (
        db.query(Cliente)
        .filter(Cliente.id == factura.cliente_id, Cliente.tenant_id == tenant_id)
        .first()
    )
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # Verificar que el número de factura no exista
    db_factura = (
        db.query(Factura)
        .filter(Factura.numero_factura == factura.numero_factura, Factura.tenant_id == tenant_id)
        .first()
    )
    if db_factura:
        raise HTTPException(status_code=400, detail="Número de factura ya registrado")
    
    nueva_factura = Factura(**factura.model_dump(), tenant_id=tenant_id)
    db.add(nueva_factura)
    db.commit()
    db.refresh(nueva_factura)
    return nueva_factura

@router.patch("/{numero_factura}/pagar", response_model=schemas.Factura)
def pagar_factura(
    numero_factura: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
    _: User = Depends(get_admin_user),
):
    """Marca una factura como pagada"""
    factura = (
        db.query(Factura)
        .filter(Factura.numero_factura == numero_factura, Factura.tenant_id == tenant_id)
        .first()
    )
    if factura is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    
    if factura.estado == "Pagada":
        raise HTTPException(status_code=400, detail="La factura ya está pagada")
    
    factura.estado = "Pagada"
    db.commit()
    db.refresh(factura)
    return factura

@router.get("/cuenta/{numero_cuenta}", response_model=List[schemas.Factura])
def read_facturas_by_numero_cuenta(
    numero_cuenta: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(get_tenant_id),
):
    """Obtiene las facturas de un cliente por su número de cuenta (usado por el frontend)"""
    cliente = (
        db.query(Cliente)
        .filter(Cliente.numero_cuenta == numero_cuenta, Cliente.tenant_id == tenant_id)
        .first()
    )
    if cliente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    facturas = (
        db.query(Factura)
        .filter(Factura.cliente_id == cliente.id, Factura.tenant_id == tenant_id)
        .all()
    )
    return facturas