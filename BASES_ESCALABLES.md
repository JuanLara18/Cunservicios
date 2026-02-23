# Bases escalables del proyecto

Este documento define la base técnica mínima para continuar el desarrollo del producto de manera ordenada, segura y multi‑cliente.

## 1) Estado base implementado

### Backend (FastAPI)
- **Configuración moderna por entorno** con `pydantic-settings`.
- **Arranque con lifespan** (sin `on_event` deprecado).
- **CORS configurable** por variable de entorno.
- **Healthcheck** en `/healthz`.
- **Compatibilidad estable de dependencias** (FastAPI + Pydantic v2 + bcrypt compatible con passlib).

### Multi‑tenant (fundación)
- Aislamiento lógico por `tenant_id` en modelos principales:
  - `users`
  - `clientes`
  - `facturas`
  - `pqrs`
- Header estándar para contexto de cliente:
  - `X-Tenant-ID` (default: `public`)
- Filtros por tenant en endpoints de autenticación, clientes, facturas, PQR y usuarios.
- Unicidad por tenant para identificadores de negocio (cuenta, factura, radicado, email de usuario).

### Frontend (React)
- Integración de **facturación real** con API (sin simulaciones principales).
- Corrección de contrato API para pago de factura (`PATCH`).
- Alineación de tipos PQR con valores esperados por backend.
- Rutas legales habilitadas:
  - `/terminos`
  - `/privacidad`
  - `/transparencia`

## 2) Criterios de escalabilidad acordados

1. **Separación por tenant desde el inicio**
   - Ningún endpoint de dominio debe devolver datos sin tenant.
2. **Contratos explícitos**
   - Mapeo API ↔ UI para evitar acoplamiento entre `snake_case` y `camelCase`.
3. **Configuración por entorno**
   - Nada sensible hardcodeado.
4. **Evolución controlada**
   - Nuevas capacidades en módulos aislados (facturación, PQR, notificaciones, cumplimiento).

## 3) Roadmap recomendado (features, no implementadas aquí)

### Fase 1: Gobierno de datos y cumplimiento
- Gestión formal de consentimientos y finalidades de tratamiento.
- Retención y supresión por política y normativa.
- Bitácora de acceso a datos sensibles por tenant.

### Fase 2: Seguridad y operación
- RBAC completo por tenant y por módulo.
- Rate limiting y protección anti abuso en endpoints públicos.
- Observabilidad: logs estructurados, trazas y métricas.

### Fase 3: Plataforma empresarial
- Migraciones con Alembic por ambiente (dev/staging/prod).
- Cola de tareas (emails, notificaciones, procesos asincrónicos).
- Capa de servicios de dominio y repositorios (desacople de endpoints).

### Fase 4: Producto
- Portal transaccional completo (pagos integrados reales).
- Gestión documental de PQR con adjuntos y SLA.
- Dashboard operacional y regulatorio por tenant.

## 4) Convenciones para continuar

- Todo endpoint nuevo debe incluir `tenant_id` de contexto.
- Cualquier dato de negocio sensible debe estar segmentado por tenant.
- Toda integración frontend debe pasar por `src/services/`.
- Todo cambio nuevo debe mantener pruebas backend verdes y build frontend exitoso.

