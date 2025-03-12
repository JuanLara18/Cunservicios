from typing import List, Optional

from pydantic import BaseModel


class ConceptoFacturaBase(BaseModel):
    concepto: str
    valor: float

class ConceptoFacturaCreate(ConceptoFacturaBase):
    pass

class ConceptoFactura(ConceptoFacturaBase):
    id: int
    factura_id: int
    
    class Config:
        from_attributes = True

# Actualizar clase Factura
class Factura(FacturaBase):
    id: int
    conceptos: Optional[List[ConceptoFactura]] = []

    class Config:
        orm_mode = True