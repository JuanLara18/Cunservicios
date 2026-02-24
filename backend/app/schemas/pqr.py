from datetime import date
from typing import Optional

from app.models.pqr import EstadoPQR, TipoPQR
from pydantic import BaseModel, ConfigDict, Field


class PQRBase(BaseModel):
    tipo: TipoPQR = Field(..., description="Tipo de PQR (Petición, Queja, Reclamo, etc.)")
    asunto: str = Field(..., description="Asunto o título del PQR", min_length=3, max_length=100)
    descripcion: str = Field(..., description="Descripción detallada del PQR", min_length=10)
    cliente_id: int = Field(..., description="ID del cliente que realiza el PQR")

class PQRCreate(PQRBase):
    pass

class PQR(PQRBase):
    id: int
    tenant_id: str
    fecha_creacion: date
    fecha_respuesta: Optional[date] = None
    estado: EstadoPQR
    radicado: str

    model_config = ConfigDict(from_attributes=True)