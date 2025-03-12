import pytest
from fastapi import status


def test_read_clientes(client, admin_token_headers, test_cliente):
    """Prueba para obtener la lista de clientes"""
    response = client.get("/api/clientes/", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    
    # Verificar que el cliente de prueba esté en la lista
    cliente_ids = [cliente["id"] for cliente in data]
    assert test_cliente.id in cliente_ids

def test_read_cliente_by_numero_cuenta(client, admin_token_headers, test_cliente):
    """Prueba para obtener un cliente por su número de cuenta"""
    response = client.get(f"/api/clientes/{test_cliente.numero_cuenta}", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_cliente.id
    assert data["nombre"] == test_cliente.nombre
    assert data["numero_cuenta"] == test_cliente.numero_cuenta
    assert data["estrato"] == test_cliente.estrato

def test_read_cliente_not_found(client, admin_token_headers):
    """Prueba para obtener un cliente inexistente"""
    non_existent_numero_cuenta = "999999"
    response = client.get(f"/api/clientes/{non_existent_numero_cuenta}", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "detail" in response.json()

def test_create_cliente(client, admin_token_headers):
    """Prueba para crear un nuevo cliente"""
    nuevo_cliente = {
        "nombre": "Nuevo Cliente",
        "direccion": "Calle Nueva 456",
        "telefono": "3112345678",
        "correo": "nuevo@cliente.com",
        "numero_cuenta": "555666",
        "estrato": 4
    }
    
    response = client.post("/api/clientes/", json=nuevo_cliente, headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["nombre"] == nuevo_cliente["nombre"]
    assert data["numero_cuenta"] == nuevo_cliente["numero_cuenta"]
    assert data["estrato"] == nuevo_cliente["estrato"]
    assert "id" in data

def test_create_cliente_duplicate_cuenta(client, admin_token_headers, test_cliente):
    """Prueba para crear un cliente con número de cuenta duplicado"""
    cliente_duplicado = {
        "nombre": "Cliente Duplicado",
        "direccion": "Calle Duplicada 789",
        "telefono": "3223456789",
        "correo": "duplicado@cliente.com",
        "numero_cuenta": test_cliente.numero_cuenta,  # Usar el mismo número de cuenta
        "estrato": 5
    }
    
    response = client.post("/api/clientes/", json=cliente_duplicado, headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "detail" in response.json()