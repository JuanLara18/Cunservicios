
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base
from datetime import datetime

class TipoPQR(enum.Enum):
    PETICION = "Petición"
    QUEJA = "Queja"
    RECLAMO = "Reclamo"
    SUGERENCIA = "Sugerencia"
    DENUNCIA = "Denuncia"

class EstadoPQR(enum.Enum):
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

