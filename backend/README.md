# Cunservicios Backend API

## Overview

This is the backend API service for the Cunservicios platform, providing the server-side functionality for water and sewage utility services management. The API is built with FastAPI and follows modern best practices for Python web application development.

## 📋 Table of Contents

- [Cunservicios Backend API](#cunservicios-backend-api)
  - [Overview](#overview)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [📁 Project Structure](#-project-structure)
  - [📝 API Documentation](#-api-documentation)
    - [API Endpoints](#api-endpoints)
  - [🗃️ Database](#️-database)
    - [Models](#models)
    - [Migrations](#migrations)
    - [Database Configuration](#database-configuration)
  - [🔐 Authentication](#-authentication)
  - [💻 Development Workflow](#-development-workflow)
    - [Adding a New Endpoint](#adding-a-new-endpoint)
    - [Code Formatting](#code-formatting)
  - [🧪 Testing](#-testing)
  - [📦 Deployment](#-deployment)
    - [Docker Deployment](#docker-deployment)
    - [Production Considerations](#production-considerations)
  - [👍 Best Practices](#-best-practices)
    - [Performance Optimization](#performance-optimization)
    - [Security](#security)
    - [Code Quality](#code-quality)
  - [🔧 Troubleshooting](#-troubleshooting)
    - [Common Issues](#common-issues)
    - [Debugging Tips](#debugging-tips)
  - [🤝 Support](#-support)

## ✨ Features

- **RESTful API**: Modern, standard-compliant API endpoints
- **User Management**: Authentication, authorization, and user profile handling
- **Billing System**: Invoice generation, payment processing, and history
- **PQR Management**: Handling of petitions, complaints, and claims
- **Customer Management**: CRUD operations for customer data
- **Automated Documentation**: Auto-generated API docs via Swagger and ReDoc
- **Database Abstraction**: SQLAlchemy ORM for database operations
- **Schema Validation**: Request/response validation with Pydantic
- **Security**: JWT authentication, role-based access control

## 🛠️ Technology Stack

- **Python 3.10+**: Core programming language
- **FastAPI**: Modern, high-performance web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation and settings management
- **Alembic**: Database migration tool
- **PostgreSQL**: Primary database (configurable)
- **Pytest**: Testing framework
- **Python-jose**: JWT token handling
- **Passlib**: Password hashing
- **Uvicorn**: ASGI server

## 🚀 Getting Started

### Prerequisites

- [Python](https://www.python.org/) (v3.10+)
- [pip](https://pip.pypa.io/)
- [PostgreSQL](https://www.postgresql.org/) (or SQLite for development)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/your-organization/cunservicios.git
   cd cunservicios/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to configure your database and other settings.

5. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at [http://localhost:8000](http://localhost:8000).

## 📁 Project Structure

```
app/
├── api/                    # API endpoints
│   ├── endpoints/          # Route handlers by resource
│   │   ├── users.py        # User-related endpoints
│   │   ├── facturas.py     # Billing-related endpoints
│   │   ├── clientes.py     # Customer-related endpoints
│   │   └── pqrs.py         # PQR-related endpoints
│   └── dependencies.py     # Shared API dependencies
├── core/                   # Core functionality
│   └── config.py           # Configuration settings
├── db/                     # Database configuration
│   └── database.py         # Database setup
├── models/                 # SQLAlchemy ORM models
│   ├── user.py             # User model
│   ├── factura.py          # Invoice model
│   ├── cliente.py          # Customer model
│   └── pqr.py              # PQR model
├── schemas/                # Pydantic schemas
│   ├── user.py             # User schemas
│   ├── factura.py          # Invoice schemas
│   ├── cliente.py          # Customer schemas
│   └── pqr.py              # PQR schemas
├── services/               # Business logic services
├── utils/                  # Utility functions
└── main.py                 # Application entry point

tests/                      # Test directory
├── conftest.py             # Test configuration
└── api/                    # API tests
    ├── test_users.py       # User endpoint tests
    ├── test_facturas.py    # Invoice endpoint tests
    └── ...
```

## 📝 API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### API Endpoints

The API provides the following main resource endpoints:

- **Users**: `/api/users`
  - Authentication and user management

- **Clientes (Customers)**: `/api/clientes`
  - Customer data management

- **Facturas (Invoices)**: `/api/facturas`
  - Invoice consultation and payment

- **PQRs**: `/api/pqrs`
  - Petitions, complaints, and claims management

Detailed endpoint documentation is available in the Swagger UI.

## 🗃️ Database

### Models

SQLAlchemy models are defined in the `app/models/` directory:

```python
# Example model - app/models/cliente.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    direccion = Column(String)
    telefono = Column(String)
    correo = Column(String)
    numero_cuenta = Column(String, unique=True, index=True)
    estrato = Column(Integer)
    
    facturas = relationship("Factura", back_populates="cliente")
```

### Migrations

Database migrations are handled by Alembic:

```bash
# Generate a new migration
alembic revision --autogenerate -m "Description of changes"

# Run migrations
alembic upgrade head
```

### Database Configuration

Database settings are specified in `app/core/config.py` and can be overridden via environment variables.

## 🔐 Authentication

The API uses JWT (JSON Web Token) for authentication:

1. **Login**: Users authenticate via `/api/auth/login`
2. **Token**: A JWT token is returned
3. **Authorization**: The token is sent in the `Authorization` header for protected routes

Implementation details:

```python
# Example dependency for protected routes
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.auth import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return verify_token(token, credentials_exception)
```

## 🏢 Multi-tenant foundation

The API is prepared to isolate data by tenant using the `X-Tenant-ID` header.

- If header is not provided, it defaults to `public`.
- Main entities (`users`, `clientes`, `facturas`, `pqrs`) are filtered by tenant.
- Tokens include tenant context to prevent cross-tenant access.

Example:

```bash
curl -H "X-Tenant-ID: cliente-a" http://localhost:8000/api/clientes/
```

## 💻 Development Workflow

### Adding a New Endpoint

To add a new API endpoint:

1. Create or update a model in `app/models/`
2. Create or update a schema in `app/schemas/`
3. Add the endpoint in `app/api/endpoints/`
4. Register the router in `app/main.py`

Example:

```python
# app/api/endpoints/nuevo_recurso.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas import nuevo_schema
from app.db.database import get_db

router = APIRouter(prefix="/nuevo-recurso", tags=["nuevo-recurso"])

@router.get("/", response_model=list[nuevo_schema.Resource])
def read_resources(db: Session = Depends(get_db)):
    # Implementation here
    pass
```

```python
# In app/main.py
from app.api.endpoints import nuevo_recurso

app.include_router(nuevo_recurso.router, prefix="/api")
```

### Code Formatting

The project uses Black for code formatting:

```bash
# Format code
black app tests

# Check formatting
black --check app tests
```

## 🧪 Testing

The project uses pytest for testing:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/api/test_users.py
```

Example test:

```python
# tests/api/test_users.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_users():
    response = client.get("/api/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

## 📦 Deployment

### Docker Deployment

A Dockerfile is included for containerized deployment:

```bash
# Build the image
docker build -t cunservicios-backend .

# Run the container
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:password@host:port/dbname \
  -e SECRET_KEY=your-secret-key \
  cunservicios-backend
```

### Production Considerations

For production deployment:

1. Use a production ASGI server:
   ```bash
   gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4
   ```

2. Set secure environment variables:
   - Generate a strong SECRET_KEY
   - Set BACKEND_CORS_ORIGINS to specific origins
   - Use a production-ready database

3. Enable HTTPS:
   - Use a reverse proxy (Nginx, Traefik)
   - Configure TLS/SSL certificates

## 👍 Best Practices

### Performance Optimization

- Use async handlers for I/O-bound operations
- Implement pagination for large result sets
- Use appropriate database indexes
- Cache frequently accessed data

### Security

- Never hardcode secrets
- Validate all input data with Pydantic
- Implement rate limiting for public endpoints
- Follow the principle of least privilege for database access

### Code Quality

- Write comprehensive tests
- Document your code with docstrings
- Follow PEP 8 style guide
- Use type annotations

## 🔧 Troubleshooting

### Common Issues

1. **Database connection issues**:
   - Verify database credentials in `.env`
   - Check that the database server is running
   - Ensure network access to the database

2. **Migration errors**:
   - Make sure models are imported in `alembic/env.py`
   - Check for circular imports

3. **Dependency issues**:
   - Verify virtual environment is activated
   - Ensure all dependencies are installed: `pip install -r requirements.txt`

### Debugging Tips

- Enable debug mode in development
- Use logging for better visibility
- Check FastAPI documentation for specific error messages

## 🤝 Support

For questions and support, please contact:
- Email: backend-support@cunservicios.com
- Issue Tracker: [GitHub Issues](https://github.com/your-organization/cunservicios/issues)