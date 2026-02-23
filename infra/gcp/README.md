# Despliegue en GCP (Cloud Run + Cloud SQL)

Este proyecto queda preparado para despliegue escalable en Google Cloud Platform, sin dependencias de Heroku.

## Arquitectura recomendada

- **Frontend**: Cloud Run (contenedor Nginx con SPA React)
- **Backend**: Cloud Run (FastAPI + Gunicorn/Uvicorn)
- **Base de datos**: Cloud SQL PostgreSQL (produccion)
- **Contenedores**: Artifact Registry
- **Secretos**: Secret Manager
- **Dominio**: GoDaddy apuntando a los servicios de Cloud Run

## Servicios con costo (estimacion inicial)

> Valores aproximados, varian por region, trafico y configuracion.

- **Cloud Run**:
  - Costo bajo en etapas tempranas, pago por uso (CPU/RAM/requests).
- **Cloud SQL PostgreSQL**:
  - Es el costo fijo principal en un MVP productivo.
- **Artifact Registry**:
  - Bajo costo por almacenamiento de imagenes.
- **Secret Manager**:
  - Bajo costo por secreto/version.
- **Cloud Logging/Monitoring**:
  - Incluye cuota gratuita, luego pago por volumen.

## Parametros minimos recomendados

### Backend (Cloud Run)
- Min instances: `0` (arranque barato)
- Max instances: `10` (ajustable)
- CPU: `1`
- RAM: `512Mi` a `1Gi`
- Concurrency: `40` a `80`

### Frontend (Cloud Run)
- Min instances: `0`
- Max instances: `5`
- CPU: `1`
- RAM: `256Mi` a `512Mi`
- Concurrency: `80`

## Variables de entorno criticas

### Backend
- `ENV=production`
- `DATABASE_URL=postgresql://...`
- `SECRET_KEY=...` (desde Secret Manager)
- `BACKEND_CORS_ORIGINS=https://app.tu-dominio.com`
- `DEFAULT_TENANT_ID=public`
- `AUTO_CREATE_TABLES=false`
- `ENABLE_SEED_DATA=false`

### Frontend (build-time)
- `REACT_APP_API_URL=https://api.tu-dominio.com`
- `REACT_APP_TENANT_ID=public`

## Flujo recomendado de despliegue

1. Crear repositorio en Artifact Registry.
2. Configurar Cloud SQL (PostgreSQL) y usuario/aplicacion.
3. Crear secretos (SECRET_KEY, DATABASE_URL si aplica).
4. Desplegar backend usando `infra/gcp/cloudbuild.backend.yaml`.
5. Desplegar frontend usando `infra/gcp/cloudbuild.frontend.yaml`.
6. Configurar dominio en GoDaddy:
   - `api.tu-dominio.com` -> servicio backend Cloud Run
   - `app.tu-dominio.com` -> servicio frontend Cloud Run
7. Ajustar CORS backend con dominio final del frontend.

## Archivos de apoyo en este directorio

- `cloudbuild.backend.yaml`
- `cloudbuild.frontend.yaml`

