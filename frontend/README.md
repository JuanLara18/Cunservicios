# Frontend

Aplicación web del proyecto Cunservicios.

## Stack

- React 18
- React Router
- Axios
- Formik + Yup
- Tailwind CSS

## Ejecución local

```bash
npm install
npm start
```

## Variables de entorno

Archivo base: `.env.example`

Variables mínimas:

- `REACT_APP_API_URL`
- `REACT_APP_TENANT_ID`

## Build

```bash
npm run build
```

## Docker

```bash
docker build -t cunservicios-frontend .
docker run --rm -p 3000:8080 cunservicios-frontend
```

## Integración con backend

- La URL de API se inyecta por `REACT_APP_API_URL`.
- El tenant por defecto se envía con `X-Tenant-ID`.
- El tenant activo del portal puede cambiarse en tiempo de ejecución y se persiste en navegador.
- El portal cliente usa autenticación real contra `POST /api/auth/login`.

## Portal cliente (base escalable)

Se añadió una estructura inicial de portal en `/portal` para clientes institucionales (alcaldías):

- `/portal/login`: acceso inicial del cliente.
- `/portal`: resumen operativo.
- `/portal/recibos`: generación simple de recibos desde plantilla CREG.
- `/portal/datos`: bandeja de insumos para carga manual y normalización futura.
- `/portal/configuracion`: ajustes base del tenant.

Esta base está diseñada para crecer por módulos sin romper rutas existentes.
Para producción, se recomienda revisar `docs/security-production.md`.

Mejoras recientes de componentes del portal:

- Validación de tenant en login/configuración.
- Manejo de sesión expirada desde interceptor de API.
- Recibos con descarga TXT/Markdown, copia al portapapeles y filtros de histórico.
- Bandeja de datos con estado/prioridad, filtros y acciones de seguimiento.
- Configuración con cambio de contraseña conectado al backend.

## Referencias

- Arquitectura general: `../docs/architecture.md`
- Despliegue GCP: `../docs/deployment-gcp.md`