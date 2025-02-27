
from pydantic import BaseModel, EmailStr
from typing import Optional, List
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
    facturas: Optional[List[Factura]] = []

    class Config:
        orm_mode = True

