# Roadmap técnico

## Estado actual

- Base multi-tenant implementada en backend.
- Frontend conectado a API real para facturación y PQR.
- Base de despliegue GCP lista.

## Próximas fases

### Fase 1: Cumplimiento y datos

- Gestión de consentimientos.
- Trazabilidad de acceso a datos.
- Políticas de retención y supresión.

### Fase 2: Seguridad y operación

- RBAC por tenant y por módulo.
- Rate limiting en endpoints públicos.
- Observabilidad (logs, métricas, alertas).

### Fase 3: Escalabilidad de producto

- Migraciones controladas con Alembic.
- Procesos asíncronos (notificaciones y tareas de negocio).
- Portal de usuarios con acceso autenticado a recibos y trazabilidad.
