import pytest
from app.models.pqr import EstadoPQR, TipoPQR
from fastapi import status


def test_read_pqrs(client, admin_token_headers, test_pqr):
    """Prueba para obtener lista de PQRs"""
    response = client.get("/api/pqrs/", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    
    # Verificar que el PQR de prueba esté en la lista
    pqr_ids = [pqr["id"] for pqr in data]
    assert test_pqr.id in pqr_ids

def test_read_pqr_by_radicado(client, admin_token_headers, test_pqr):
    """Prueba para obtener un PQR por su radicado"""
    response = client.get(f"/api/pqrs/{test_pqr.radicado}", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_pqr.id
    assert data["radicado"] == test_pqr.radicado
    assert data["tipo"] == test_pqr.tipo
    assert data["estado"] == test_pqr.estado

def test_read_pqr_not_found(client, admin_token_headers):
    """Prueba para obtener un PQR inexistente"""
    non_existent_radicado = "PQR-NONEXISTENT-999"
    response = client.get(f"/api/pqrs/{non_existent_radicado}", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "detail" in response.json()

def test_create_pqr(client, admin_token_headers, test_cliente):
    """Prueba para crear un nuevo PQR"""
    nuevo_pqr = {
        "tipo": TipoPQR.QUEJA,
        "asunto": "Queja de prueba",
        "descripcion": "Esta es una queja de prueba para testing",
        "cliente_id": test_cliente.id
    }
    
    response = client.post("/api/pqrs/", json=nuevo_pqr, headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["tipo"] == nuevo_pqr["tipo"]
    assert data["asunto"] == nuevo_pqr["asunto"]
    assert data["cliente_id"] == test_cliente.id
    assert "radicado" in data
    assert data["estado"] == EstadoPQR.RECIBIDO

def test_create_pqr_client_not_found(client, admin_token_headers):
    """Prueba para crear un PQR con cliente inexistente"""
    pqr_cliente_inexistente = {
        "tipo": TipoPQR.RECLAMO,
        "asunto": "Reclamo de prueba",
        "descripcion": "Esta es un reclamo de prueba para testing",
        "cliente_id": 9999  # ID de cliente inexistente
    }
    
    response = client.post("/api/pqrs/", json=pqr_cliente_inexistente, headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "detail" in response.json()

def test_update_pqr_estado(client, admin_token_headers, test_pqr):
    """Prueba para actualizar el estado de un PQR"""
    nuevo_estado = EstadoPQR.EN_TRAMITE
    
    response = client.patch(
        f"/api/pqrs/{test_pqr.radicado}/estado?estado={nuevo_estado.value}",
        headers=admin_token_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["estado"] == nuevo_estado

def test_update_pqr_estado_a_respondido(client, admin_token_headers, test_pqr):
    """Prueba para actualizar el estado de un PQR a respondido (debe registrar fecha)"""
    nuevo_estado = EstadoPQR.RESPONDIDO
    
    response = client.patch(
        f"/api/pqrs/{test_pqr.radicado}/estado?estado={nuevo_estado.value}",
        headers=admin_token_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["estado"] == nuevo_estado
    assert data["fecha_respuesta"] is not None

def test_filter_pqrs_by_tipo(client, admin_token_headers, test_pqr):
    """Prueba para filtrar PQRs por tipo"""
    response = client.get(
        f"/api/pqrs/?tipo={test_pqr.tipo.value}",
        headers=admin_token_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert all(pqr["tipo"] == test_pqr.tipo for pqr in data)

def test_filter_pqrs_by_estado(client, admin_token_headers, test_pqr):
    """Prueba para filtrar PQRs por estado"""
    response = client.get(
        f"/api/pqrs/?estado={test_pqr.estado.value}",
        headers=admin_token_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert all(pqr["estado"] == test_pqr.estado for pqr in data)

def test_filter_pqrs_by_cliente(client, admin_token_headers, test_pqr, test_cliente):
    """Prueba para filtrar PQRs por cliente"""
    response = client.get(
        f"/api/pqrs/?cliente_id={test_cliente.id}",
        headers=admin_token_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert all(pqr["cliente_id"] == test_cliente.id for pqr in data)