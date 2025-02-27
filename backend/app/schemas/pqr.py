
from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models.pqr import TipoPQR, EstadoPQR

class PQRBase(BaseModel):
    tipo: TipoPQR
    asunto: str
    descripcion: str
    cliente_id: int

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

