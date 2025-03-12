from datetime import datetime, timedelta

import pytest
from fastapi import status


def test_read_facturas(client, admin_token_headers, test_factura):
    """Prueba para obtener lista de facturas"""
    response = client.get("/api/facturas/", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    
    # Verificar que la factura de prueba esté en la lista
    factura_ids = [factura["id"] for factura in data]
    assert test_factura.id in factura_ids

def test_read_factura_by_numero(client, admin_token_headers, test_factura):
    """Prueba para obtener una factura por su número"""
    response = client.get(f"/api/facturas/{test_factura.numero_factura}", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_factura.id
    assert data["numero_factura"] == test_factura.numero_factura
    assert data["valor_total"] == test_factura.valor_total
    assert data["estado"] == test_factura.estado

def test_read_factura_not_found(client, admin_token_headers):
    """Prueba para obtener una factura inexistente"""
    non_existent_numero_factura = "F-NONEXISTENT-999"
    response = client.get(f"/api/facturas/{non_existent_numero_factura}", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "detail" in response.json()

def test_read_facturas_by_cliente(client, admin_token_headers, test_cliente, test_factura):
    """Prueba para obtener facturas de un cliente por su número de cuenta"""
    response = client.get(f"/api/facturas/cliente/{test_cliente.numero_cuenta}", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    
    # Verificar que la factura pertenece al cliente correcto
    for factura in data:
        assert factura["cliente_id"] == test_cliente.id

def test_create_factura(client, admin_token_headers, test_cliente):
    """Prueba para crear una nueva factura"""
    fecha_emision = datetime.now().date()
    fecha_vencimiento = (datetime.now() + timedelta(days=15)).date()
    
    nueva_factura = {
        "numero_factura": "F-TEST-NEW-123",
        "fecha_emision": fecha_emision.isoformat(),
        "fecha_vencimiento": fecha_vencimiento.isoformat(),
        "valor_total": 50000.0,
        "estado": "Pendiente",
        "cliente_id": test_cliente.id,
        "observaciones": "Factura de prueba"
    }
    
    response = client.post("/api/facturas/", json=nueva_factura, headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["numero_factura"] == nueva_factura["numero_factura"]
    assert data["valor_total"] == nueva_factura["valor_total"]
    assert data["cliente_id"] == test_cliente.id

def test_create_factura_duplicate_numero(client, admin_token_headers, test_cliente, test_factura):
    """Prueba para crear factura con número duplicado"""
    fecha_emision = datetime.now().date()
    fecha_vencimiento = (datetime.now() + timedelta(days=15)).date()
    
    factura_duplicada = {
        "numero_factura": test_factura.numero_factura,  # Usar el mismo número de factura
        "fecha_emision": fecha_emision.isoformat(),
        "fecha_vencimiento": fecha_vencimiento.isoformat(),
        "valor_total": 40000.0,
        "estado": "Pendiente",
        "cliente_id": test_cliente.id
    }
    
    response = client.post("/api/facturas/", json=factura_duplicada, headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "detail" in response.json()

def test_pagar_factura(client, admin_token_headers, test_factura):
    """Prueba para marcar una factura como pagada"""
    response = client.patch(f"/api/facturas/{test_factura.numero_factura}/pagar", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["estado"] == "Pagada"

def test_pagar_factura_already_paid(client, admin_token_headers, test_factura, db):
    """Prueba para pagar una factura ya pagada"""
    # Primero pagamos la factura
    test_factura.estado = "Pagada"
    db.commit()
    
    response = client.patch(f"/api/facturas/{test_factura.numero_factura}/pagar", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "detail" in response.json()