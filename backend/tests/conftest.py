import pytest
from app.core.security import get_password_hash
from app.db.database import Base, get_db
from app.main import app
from app.models.cliente import Cliente
from app.models.factura import ConceptoFactura, Factura
from app.models.pqr import PQR, EstadoPQR, TipoPQR
from app.models.user import User
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Crear base de datos en memoria para pruebas
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    # Crear tablas en la base de datos
    Base.metadata.create_all(bind=engine)
    
    # Crear una sesión para las pruebas
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Limpiar tablas después de cada prueba
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    # Sobrescribir la dependencia para usar la base de datos de prueba
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    
    # Restablecer override después de la prueba
    app.dependency_overrides = {}

@pytest.fixture(scope="function")
def test_user(db):
    """Crear un usuario de prueba"""
    user = User(
        email="testuser@example.com",
        hashed_password=get_password_hash("testpassword"),
        is_active=True,
        is_admin=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="function")
def test_admin(db):
    """Crear un usuario administrador de prueba"""
    admin = User(
        email="admin@example.com",
        hashed_password=get_password_hash("adminpassword"),
        is_active=True,
        is_admin=True
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

@pytest.fixture(scope="function")
def test_cliente(db):
    """Crear un cliente de prueba"""
    cliente = Cliente(
        nombre="Cliente Test",
        direccion="Calle Test 123",
        telefono="3001234567",
        correo="cliente@test.com",
        numero_cuenta="987654",
        estrato=3
    )
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente

@pytest.fixture(scope="function")
def test_factura(db, test_cliente):
    """Crear una factura de prueba"""
    from datetime import datetime, timedelta
    
    fecha_emision = datetime.now().date()
    fecha_vencimiento = (datetime.now() + timedelta(days=15)).date()
    
    factura = Factura(
        numero_factura="F-TEST-123456",
        fecha_emision=fecha_emision,
        fecha_vencimiento=fecha_vencimiento,
        valor_total=75000.0,
        estado="Pendiente",
        cliente_id=test_cliente.id
    )
    db.add(factura)
    db.commit()
    db.refresh(factura)
    
    # Añadir conceptos a la factura
    conceptos = [
        ConceptoFactura(factura_id=factura.id, concepto="Cargo fijo acueducto", valor=25000.0),
        ConceptoFactura(factura_id=factura.id, concepto="Consumo acueducto", valor=30000.0),
        ConceptoFactura(factura_id=factura.id, concepto="Cargo fijo alcantarillado", valor=10000.0),
        ConceptoFactura(factura_id=factura.id, concepto="Servicio alcantarillado", valor=10000.0)
    ]
    
    for concepto in conceptos:
        db.add(concepto)
    
    db.commit()
    return factura

@pytest.fixture(scope="function")
def test_pqr(db, test_cliente):
    """Crear un PQR de prueba"""
    from datetime import datetime
    
    pqr = PQR(
        tipo=TipoPQR.PETICION,
        asunto="Solicitud de prueba",
        descripcion="Esta es una solicitud de prueba para testing",
        fecha_creacion=datetime.now().date(),
        estado=EstadoPQR.RECIBIDO,
        radicado="PQR-TEST-1234",
        cliente_id=test_cliente.id
    )
    db.add(pqr)
    db.commit()
    db.refresh(pqr)
    return pqr

@pytest.fixture(scope="function")
def user_token_headers(client, test_user):
    """Obtener headers con token de autenticación para usuario normal"""
    login_data = {
        "username": test_user.email,
        "password": "testpassword"
    }
    response = client.post("/api/auth/login", data=login_data)
    token = response.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="function")
def admin_token_headers(client, test_admin):
    """Obtener headers con token de autenticación para administrador"""
    login_data = {
        "username": test_admin.email,
        "password": "adminpassword"
    }
    response = client.post("/api/auth/login", data=login_data)
    token = response.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}