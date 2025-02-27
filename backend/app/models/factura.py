
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Factura(Base):
    __tablename__ = "facturas"

    id = Column(Integer, primary_key=True, index=True)
    numero_factura = Column(String, index=True, unique=True)
    fecha_emision = Column(Date)
    fecha_vencimiento = Column(Date)
    valor_total = Column(Float)
    estado = Column(String)  # "Pagada", "Pendiente", "Vencida"
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    
    cliente = relationship("Cliente", back_populates="facturas")

