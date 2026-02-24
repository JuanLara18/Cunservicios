from app.core.config import settings
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


def test_login_rate_limit_after_failed_attempts(client):
    """Prueba de bloqueo temporal por intentos fallidos repetidos."""
    login_data = {
        "username": "rate-limit-test@example.com",
        "password": "wrongpassword",
    }

    for _ in range(settings.AUTH_MAX_FAILED_ATTEMPTS):
        response = client.post("/api/auth/login", data=login_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    blocked_response = client.post("/api/auth/login", data=login_data)
    assert blocked_response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    assert "detail" in blocked_response.json()


def test_protected_data_endpoints_require_token(client):
    """Verifica que rutas de datos no permitan acceso sin token."""
    response_clientes = client.get("/api/clientes/")
    assert response_clientes.status_code == status.HTTP_401_UNAUTHORIZED

    response_alumbrado = client.get("/api/alumbrado/parametros?anno=2026")
    assert response_alumbrado.status_code == status.HTTP_401_UNAUTHORIZED


def test_security_headers_are_present(client):
    """Verifica headers base de seguridad en respuestas HTTP."""
    response = client.get("/healthz")
    assert response.status_code == status.HTTP_200_OK
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == settings.SECURITY_FRAME_OPTIONS
    assert response.headers.get("Referrer-Policy") == settings.SECURITY_REFERRER_POLICY
    assert response.headers.get("Content-Security-Policy") == settings.SECURITY_CONTENT_SECURITY_POLICY