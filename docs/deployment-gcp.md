# Despliegue en GCP

Guía de despliegue seguro en Cloud Run para frontend y backend.

## Arquitectura objetivo

```mermaid
flowchart LR
    DNS[GoDaddy DNS] --> FE[Cloud Run Frontend]
    DNS --> BE[Cloud Run Backend]
    FE --> BE
    BE --> SQL[(Cloud SQL PostgreSQL)]
    BE --> SM[Secret Manager]
    FE --> AR[Artifact Registry]
    BE --> AR
```

## Prerrequisitos

- Proyecto en GCP.
- Artifact Registry habilitado.
- Cloud Run habilitado.
- Cloud SQL PostgreSQL provisionado.
- Secret Manager habilitado.
- APIs recomendadas: Cloud Build, Monitoring, Logging.

## Secretos requeridos

Crear en Secret Manager:

- `cunservicios-secret-key`
- `cunservicios-database-url`

Ejemplo:

```bash
echo -n "super-secret-key" | gcloud secrets create cunservicios-secret-key --data-file=-
echo -n "postgresql://user:pass@host:5432/dbname" | gcloud secrets create cunservicios-database-url --data-file=-
```

## Cloud Build (backend)

Archivo: `infra/gcp/cloudbuild.backend.yaml`

Puntos clave:

- Imagen en Artifact Registry.
- Deploy a Cloud Run con:
  - `ENV=production`
  - `DEBUG=false`
  - `ENFORCE_AUTH_ON_DATA_ENDPOINTS=true`
  - `ENABLE_SECURITY_HEADERS=true`
  - `ENABLE_HTTPS_REDIRECT=true`
- `DATABASE_URL` y `SECRET_KEY` inyectados desde Secret Manager.

## Cloud Build (frontend)

Archivo: `infra/gcp/cloudbuild.frontend.yaml`

Puntos clave:

- Build con `REACT_APP_API_URL` apuntando al backend real.
- Deploy a Cloud Run con recursos configurables (CPU, memoria, instancias).
- Nginx con headers de seguridad y healthcheck.

## DNS y dominios

Configurar en GoDaddy:

- `app.tu-dominio.com` -> frontend Cloud Run
- `api.tu-dominio.com` -> backend Cloud Run

Actualizar backend:

- `BACKEND_CORS_ORIGINS=https://app.tu-dominio.com`
- `ALLOWED_HOSTS=api.tu-dominio.com`

## Variables críticas de backend

- `ENV`
- `DEBUG`
- `DATABASE_URL` (desde Secret Manager)
- `SECRET_KEY` (desde Secret Manager)
- `BACKEND_CORS_ORIGINS`
- `ALLOWED_HOSTS`
- `DEFAULT_TENANT_ID`

## Recomendaciones operativas

- Deshabilitar `AUTO_CREATE_TABLES` y usar migraciones.
- Habilitar backups automáticos y PITR en Cloud SQL.
- Configurar alertas de errores 5xx y picos de 401/429.
- Aplicar Cloud Armor al perímetro para protección adicional.

Ver también: `docs/security-production.md`.
