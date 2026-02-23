from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ConceptoFacturaBase(BaseModel):
    concepto: str
    valor: float

class ConceptoFacturaCreate(ConceptoFacturaBase):
    pass

class ConceptoFactura(ConceptoFacturaBase):
    id: int
    factura_id: int

    model_config = ConfigDict(from_attributes=True)

# Clase base que faltaba
class FacturaBase(BaseModel):
    numero_factura: str
    fecha_emision: date
    fecha_vencimiento: date
    valor_total: float
    estado: str
    cliente_id: int
    observaciones: Optional[str] = None

class FacturaCreate(FacturaBase):
    pass

# Actualizamos para usar from_attributes en lugar de orm_mode
class Factura(FacturaBase):
    id: int
    tenant_id: str
    conceptos: Optional[List[ConceptoFactura]] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)