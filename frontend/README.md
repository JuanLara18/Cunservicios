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

## Referencias

- Arquitectura general: `../docs/architecture.md`
- Despliegue GCP: `../docs/deployment-gcp.md`