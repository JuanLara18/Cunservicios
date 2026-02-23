from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from .factura import Factura

class ClienteBase(BaseModel):
    nombre: str
    direccion: str
    telefono: str
    correo: EmailStr
    numero_cuenta: str
    estrato: int

class ClienteCreate(ClienteBase):
    pass

class Cliente(ClienteBase):
    id: int
    tenant_id: str
    facturas: Optional[List[Factura]] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

