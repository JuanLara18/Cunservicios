import random
import string
from datetime import datetime, timedelta

from app.core.security import get_password_hash
from app.models.cliente import Cliente
from app.models.factura import Factura
from app.models.pqr import PQR, EstadoPQR, TipoPQR
from app.models.user import User
from sqlalchemy.orm import Session


def generate_radicado():
    """Genera un número de radicado aleatorio para PQRs"""
    return f"PQR-{datetime.now().strftime('%Y%m%d')}-{''.join(random.choices(string.digits, k=4))}"

def init_db(db: Session) -> None:
    """Inicializa la base de datos con datos de prueba"""
    
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
    
    # Crear clientes de ejemplo
    for i, cuenta in enumerate(["123456", "234567", "345678"], 1):
        cliente = db.query(Cliente).filter(Cliente.numero_cuenta == cuenta).first()
        if not cliente:
            cliente = Cliente(
                nombre=f"Usuario Prueba {i}",
                direccion=f"Calle {i*10} #{i*5}-{i*7}, Chía",
                telefono=f"30012345{i*10}",
                correo=f"usuario{i}@example.com",
                numero_cuenta=cuenta,
                estrato=random.randint(1, 6)
            )
            db.add(cliente)
            db.flush()  # Para obtener el ID asignado
            
            # Crear facturas para este cliente
            for month in range(1, 4):  # Últimos 3 meses
                fecha_emision = datetime.now() - timedelta(days=30*month)
                fecha_vencimiento = fecha_emision + timedelta(days=15)
                
                # Decidir estado basado en fechas
                if datetime.now() > fecha_vencimiento:
                    estado = random.choice(["Pagada", "Vencida"])
                else:
                    estado = "Pendiente"
                
                factura = Factura(
                    numero_factura=f"F-{fecha_emision.strftime('%Y%m')}-{cuenta}",
                    fecha_emision=fecha_emision.date(),
                    fecha_vencimiento=fecha_vencimiento.date(),
                    valor_total=round(random.uniform(50000, 100000), 2),
                    estado=estado,
                    cliente_id=cliente.id
                )
                db.add(factura)
            
            # Crear un PQR para algunos clientes
            if i % 2 == 0:  # Solo para algunos clientes
                pqr = PQR(
                    tipo=random.choice(list(TipoPQR)),
                    asunto="Solicitud de revisión de servicio",
                    descripcion="Necesito una revisión del servicio debido a problemas recientes.",
                    fecha_creacion=datetime.now().date(),
                    estado=random.choice(list(EstadoPQR)),
                    radicado=generate_radicado(),
                    cliente_id=cliente.id
                )
                db.add(pqr)
    
    db.commit()