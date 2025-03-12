# backend/app/db/init_db.py
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.user import User
from app.models.cliente import Cliente
from app.models.factura import Factura
from app.models.pqr import PQR, TipoPQR, EstadoPQR
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    # Crear usuario administrador
    admin = db.query(User).filter(User.email == "admin@cunservicios.com").first()
    if not admin:
        admin = User(
            email="admin@cunservicios.com",
            hashed_password=get_password_hash("adminpass"),
            is_active=True,
            is_admin=True,
        )
        db.add(admin)
    
    # Crear cliente de ejemplo
    cliente = db.query(Cliente).filter(Cliente.numero_cuenta == "123456").first()
    if not cliente:
        cliente = Cliente(
            nombre="Juan Pérez",
            direccion="Calle 123 #45-67, Chía",
            telefono="3001234567",
            correo="juan.perez@example.com",
            numero_cuenta="123456",
            estrato=3
        )
        db.add(cliente)
        db.flush()
        
        # Crear factura de ejemplo
        factura = Factura(
            numero_factura="F-2024-123456",
            fecha_emision=datetime.now().date(),
            fecha_vencimiento=(datetime.now() + timedelta(days=30)).date(),
            valor_total=75000.0,
            estado="Pendiente",
            cliente_id=cliente.id
        )
        db.add(factura)
        
        # Crear PQR de ejemplo
        pqr = PQR(
            tipo=TipoPQR.PETICION,
            asunto="Solicitud de revisión de medidor",
            descripcion="El medidor presenta lecturas irregulares en los últimos dos meses.",
            fecha_creacion=datetime.now().date(),
            estado=EstadoPQR.EN_TRAMITE,
            radicado="PQR-20240215",
            cliente_id=cliente.id
        )
        db.add(pqr)
    
    db.commit()