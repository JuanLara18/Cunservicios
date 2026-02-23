from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base

class Cliente(Base):
    __tablename__ = "clientes"
    __table_args__ = (
        UniqueConstraint("tenant_id", "numero_cuenta", name="uq_clientes_tenant_cuenta"),
    )

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(
        String(64),
        nullable=False,
        index=True,
        default="public",
        server_default="public",
    )
    nombre = Column(String)
    direccion = Column(String)
    telefono = Column(String)
    correo = Column(String)
    numero_cuenta = Column(String, index=True)
    estrato = Column(Integer)
    
    facturas = relationship("Factura", back_populates="cliente")

