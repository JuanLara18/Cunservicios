# Arquitectura

## Vista de componentes

```mermaid
flowchart TB
    subgraph Client["Capa de cliente"]
        Browser[Navegador]
    end

    subgraph Frontend["Frontend"]
        React[React SPA]
    end

    subgraph Backend["Backend"]
        API[FastAPI]
        Auth[JWT + Dependencias]
        Domain[Servicios de dominio]
    end

    subgraph Data["Datos"]
        SQL[(PostgreSQL / Cloud SQL)]
    end

    Browser --> React
    React --> API
    API --> Auth
    API --> Domain
    Domain --> SQL
```

## Principios técnicos

1. **Separación por servicios**: frontend y backend desacoplados.
2. **Aislamiento multi-tenant**: datos segmentados por `tenant_id`.
3. **Contratos explícitos**: integración frontend vía capa `services`.
4. **Configuración por entorno**: sin secretos en código fuente.

## Portal cliente (fase base)

```mermaid
flowchart LR
    Login["/portal/login"]
    Dashboard["/portal"]
    Recibos["/portal/recibos"]
    Datos["/portal/datos"]
    Config["/portal/configuracion"]
    API["/api/alumbrado/..."]

    Login --> Dashboard
    Dashboard --> Recibos
    Dashboard --> Datos
    Dashboard --> Config
    Recibos --> API
```

- El portal usa una sesión inicial en frontend y permite seleccionar tenant activo.
- Los módulos se diseñaron por rutas y componentes independientes para crecer por iteraciones.
- La sesión del portal valida credenciales contra backend y aplica JWT por tenant.

## Seguridad de aplicación

- Endpoints de datos y regulación protegidos por autenticación JWT.
- Validación estricta de `tenant` en token vs `X-Tenant-ID`.
- Headers de seguridad HTTP en frontend y backend.
- Lista de hosts confiables configurable para API.

## Multi-tenant

```mermaid
sequenceDiagram
    participant C as Cliente API
    participant B as Backend
    participant D as Base de datos

    C->>B: Request + X-Tenant-ID
    B->>B: Validar tenant y token JWT
    B->>D: Query filtrada por tenant_id
    D-->>B: Datos del tenant
    B-->>C: Response aislada por tenant
```
