
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    direccion = Column(String)
    telefono = Column(String)
    correo = Column(String)
    numero_cuenta = Column(String, unique=True, index=True)
    estrato = Column(Integer)
    
    facturas = relationship("Factura", back_populates="cliente")

