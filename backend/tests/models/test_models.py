from datetime import datetime, timedelta

import pytest
from app.models.factura import Factura
from app.models.pqr import PQR, EstadoPQR, TipoPQR


def test_factura_esta_vencida(db, test_cliente):
    """Prueba el método esta_vencida de Factura"""
    # Crear factura con fecha de vencimiento pasada
    fecha_emision = datetime.now().date() - timedelta(days=30)
    fecha_vencimiento = datetime.now().date() - timedelta(days=15)
    
    factura_vencida = Factura(
        numero_factura="F-VENCIDA-123",
        fecha_emision=fecha_emision,
        fecha_vencimiento=fecha_vencimiento,
        valor_total=50000.0,
        estado="Pendiente",
        cliente_id=test_cliente.id
    )
    
    # Crear factura con fecha de vencimiento futura
    fecha_emision_futura = datetime.now().date()
    fecha_vencimiento_futura = datetime.now().date() + timedelta(days=15)
    
    factura_pendiente = Factura(
        numero_factura="F-PENDIENTE-123",
        fecha_emision=fecha_emision_futura,
        fecha_vencimiento=fecha_vencimiento_futura,
        valor_total=50000.0,
        estado="Pendiente",
        cliente_id=test_cliente.id
    )
    
    # Crear factura vencida pero pagada
    factura_pagada = Factura(
        numero_factura="F-PAGADA-123",
        fecha_emision=fecha_emision,
        fecha_vencimiento=fecha_vencimiento,
        valor_total=50000.0,
        estado="Pagada",
        cliente_id=test_cliente.id
    )
    
    db.add_all([factura_vencida, factura_pendiente, factura_pagada])
    db.commit()
    
    assert factura_vencida.esta_vencida == True
    assert factura_pendiente.esta_vencida == False
    assert factura_pagada.esta_vencida == False

def test_factura_actualizar_estado(db, test_cliente):
    """Prueba el método actualizar_estado de Factura"""
    # Crear factura con fecha de vencimiento pasada
    fecha_emision = datetime.now().date() - timedelta(days=30)
    fecha_vencimiento = datetime.now().date() - timedelta(days=15)
    
    factura = Factura(
        numero_factura="F-ACTUALIZAR-123",
        fecha_emision=fecha_emision,
        fecha_vencimiento=fecha_vencimiento,
        valor_total=50000.0,
        estado="Pendiente",
        cliente_id=test_cliente.id
    )
    
    db.add(factura)
    db.commit()
    
    # Verificar que se actualiza a "Vencida"
    estado = factura.actualizar_estado()
    assert estado == "Vencida"
    assert factura.estado == "Vencida"
    
    # Cambiar a "Pagada"
    factura.estado = "Pagada"
    db.commit()
    
    # Verificar que se mantiene como "Pagada"
    estado = factura.actualizar_estado()
    assert estado == "Pagada"
    assert factura.estado == "Pagada"

def test_enum_tipos_pqr():
    """Prueba los tipos de PQR"""
    tipos = list(TipoPQR)
    assert len(tipos) == 5
    assert TipoPQR.PETICION in tipos
    assert TipoPQR.QUEJA in tipos
    assert TipoPQR.RECLAMO in tipos
    assert TipoPQR.SUGERENCIA in tipos
    assert TipoPQR.DENUNCIA in tipos

def test_enum_estados_pqr():
    """Prueba los estados de PQR"""
    estados = list(EstadoPQR)
    assert len(estados) == 4
    assert EstadoPQR.RECIBIDO in estados
    assert EstadoPQR.EN_TRAMITE in estados
    assert EstadoPQR.RESPONDIDO in estados
    assert EstadoPQR.CERRADO in estados