import enum
from datetime import date

from app.db.database import Base
from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship


class TipoPQR(str, enum.Enum):
    PETICION = "Petición"
    QUEJA = "Queja"
    RECLAMO = "Reclamo"
    SUGERENCIA = "Sugerencia"
    DENUNCIA = "Denuncia"

class EstadoPQR(str, enum.Enum):
    RECIBIDO = "Recibido"
    EN_TRAMITE = "En trámite"
    RESPONDIDO = "Respondido"
    CERRADO = "Cerrado"

class PQR(Base):
    __tablename__ = "pqrs"
    __table_args__ = (
        UniqueConstraint("tenant_id", "radicado", name="uq_pqrs_tenant_radicado"),
    )

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(
        String(64),
        nullable=False,
        index=True,
        default="public",
        server_default="public",
    )
    tipo = Column(Enum(TipoPQR))
    asunto = Column(String)
    descripcion = Column(Text)
    fecha_creacion = Column(Date, default=date.today)
    fecha_respuesta = Column(Date, nullable=True)
    estado = Column(Enum(EstadoPQR), default=EstadoPQR.RECIBIDO)
    radicado = Column(String, index=True)
    
    cliente_id = Column(Integer, ForeignKey("clientes.id", ondelete="CASCADE"))
    cliente = relationship("Cliente")