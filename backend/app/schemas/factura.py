
from pydantic import BaseModel
from datetime import date
from typing import Optional

class FacturaBase(BaseModel):
    numero_factura: str
    fecha_emision: date
    fecha_vencimiento: date
    valor_total: float
    estado: str
    cliente_id: int

class FacturaCreate(FacturaBase):
    pass

class Factura(FacturaBase):
    id: int

    class Config:
        orm_mode = True

