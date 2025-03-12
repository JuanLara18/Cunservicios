from datetime import date
from typing import Optional

from app.models.pqr import EstadoPQR, TipoPQR
from pydantic import BaseModel, Field


class PQRBase(BaseModel):
    tipo: TipoPQR = Field(..., description="Tipo de PQR (Petición, Queja, Reclamo, etc.)")
    asunto: str = Field(..., description="Asunto o título del PQR", min_length=3, max_length=100)
    descripcion: str = Field(..., description="Descripción detallada del PQR", min_length=10)
    cliente_id: int = Field(..., description="ID del cliente que realiza el PQR")

class PQRCreate(PQRBase):
    pass

class PQR(PQRBase):
    id: int
    fecha_creacion: date
    fecha_respuesta: Optional[date] = None
    estado: EstadoPQR
    radicado: str

    class Config:
        orm_mode = True