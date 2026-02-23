from datetime import date, datetime

from app.db.database import Base
from sqlalchemy import (
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship


class ConceptoFactura(Base):
    """
    Modelo para representar los conceptos o ítems detallados en una factura.
    Cada factura puede tener múltiples conceptos como cargo fijo, consumo, etc.
    """
    __tablename__ = "conceptos_factura"

    id = Column(Integer, primary_key=True, index=True)
    factura_id = Column(Integer, ForeignKey("facturas.id", ondelete="CASCADE"), nullable=False)
    concepto = Column(String(100), nullable=False)
    valor = Column(Float, nullable=False)
    
    # Relación con la factura
    factura = relationship("Factura", back_populates="conceptos")
    
    def __repr__(self):
        return f"<ConceptoFactura(id={self.id}, concepto='{self.concepto}', valor={self.valor})>"


class Factura(Base):
    """
    Modelo para representar una factura de servicios.
    Contiene información sobre la factura y se relaciona con un cliente.
    """
    __tablename__ = "facturas"
    __table_args__ = (
        UniqueConstraint("tenant_id", "numero_factura", name="uq_facturas_tenant_numero"),
    )

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(
        String(64),
        nullable=False,
        index=True,
        default="public",
        server_default="public",
    )
    numero_factura = Column(String(50), index=True, nullable=False)
    fecha_emision = Column(Date, nullable=False, default=date.today)
    fecha_vencimiento = Column(Date, nullable=False)
    valor_total = Column(Float, nullable=False)
    estado = Column(String(20), default="Pendiente")  # "Pagada", "Pendiente", "Vencida"
    cliente_id = Column(Integer, ForeignKey("clientes.id", ondelete="CASCADE"), nullable=False)
    observaciones = Column(Text, nullable=True)
    
    # Relaciones
    cliente = relationship("Cliente", back_populates="facturas")
    conceptos = relationship("ConceptoFactura", back_populates="factura", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Factura(id={self.id}, numero='{self.numero_factura}', valor={self.valor_total}, estado='{self.estado}')>"
    
    @property
    def esta_vencida(self):
        """Determina si la factura está vencida basado en la fecha actual"""
        return datetime.now().date() > self.fecha_vencimiento and self.estado != "Pagada"
    
    def actualizar_estado(self):
        """Actualiza el estado de la factura basado en fechas y pagos"""
        if self.estado == "Pagada":
            return self.estado
            
        if datetime.now().date() > self.fecha_vencimiento:
            self.estado = "Vencida"
        else:
            self.estado = "Pendiente"
            
        return self.estado