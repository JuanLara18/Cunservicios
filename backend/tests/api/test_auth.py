import pytest
from fastapi import status


def test_login_success(client, test_user):
    """Prueba de inicio de sesión exitoso"""
    login_data = {
        "username": test_user.email,
        "password": "testpassword"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["email"] == test_user.email
    assert not data["is_admin"]

def test_login_incorrect_password(client, test_user):
    """Prueba de inicio de sesión con contraseña incorrecta"""
    login_data = {
        "username": test_user.email,
        "password": "wrongpassword"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "detail" in response.json()

def test_login_user_not_found(client):
    """Prueba de inicio de sesión con usuario inexistente"""
    login_data = {
        "username": "nonexistent@example.com",
        "password": "testpassword"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "detail" in response.json()

def test_get_current_user(client, user_token_headers):
    """Prueba para obtener información del usuario autenticado"""
    response = client.get("/api/auth/me", headers=user_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert not data["is_admin"]

def test_access_protected_route_without_token(client):
    """Prueba de acceso a ruta protegida sin token"""
    response = client.get("/api/auth/me")
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "detail" in response.json()

def test_access_admin_route_with_normal_user(client, user_token_headers):
    """Prueba de acceso a ruta de administrador con usuario normal"""
    # Intentar acceder a la lista de usuarios (ruta de admin) con un usuario normal
    response = client.get("/api/users/", headers=user_token_headers)
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "detail" in response.json()

def test_access_admin_route_with_admin(client, admin_token_headers):
    """Prueba de acceso a ruta de administrador con admin"""
    response = client.get("/api/users/", headers=admin_token_headers)
    
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)