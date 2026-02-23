# Backend

Servicio API del proyecto Cunservicios.

## Stack

- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic Settings
- JWT (python-jose)

## Ejecución local

```bash
python3 -m pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload
```

API local:

- `http://localhost:8000`
- `http://localhost:8000/docs`

## Variables de entorno

Archivo base: `.env.example`

Variables mínimas:

- `ENV`
- `DATABASE_URL`
- `SECRET_KEY`
- `BACKEND_CORS_ORIGINS`
- `DEFAULT_TENANT_ID`

## Multi-tenant

- Header requerido para contexto: `X-Tenant-ID`
- Filtro por tenant aplicado en entidades principales.
- Token JWT incluye contexto de tenant.

## Pruebas

```bash
python3 -m pytest
```

## Docker

```bash
docker build -t cunservicios-backend .
docker run --rm -p 8000:8080 --env-file .env.example cunservicios-backend
```

## Referencias

- Arquitectura general: `../docs/architecture.md`
- Despliegue GCP: `../docs/deployment-gcp.md`