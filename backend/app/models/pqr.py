import enum
from datetime import datetime

from app.db.database import Base
from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, String, Text
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

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(Enum(TipoPQR))
    asunto = Column(String)
    descripcion = Column(Text)
    fecha_creacion = Column(Date, default=datetime.now().date())
    fecha_respuesta = Column(Date, nullable=True)
    estado = Column(Enum(EstadoPQR), default=EstadoPQR.RECIBIDO)
    radicado = Column(String, unique=True, index=True)
    
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    cliente = relationship("Cliente")