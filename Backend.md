# Guía para entender el Backend de Cunservicios

Esta guía te ayudará a comprender la estructura, funcionamiento y uso del backend de la aplicación Cunservicios, un sistema para la gestión de servicios de acueducto y alcantarillado.

## Índice

1. [Visión general](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#1-visi%C3%B3n-general)
2. [Requisitos previos](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#2-requisitos-previos)
3. [Estructura del proyecto](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#3-estructura-del-proyecto)
4. [Configuración del entorno](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#4-configuraci%C3%B3n-del-entorno)
5. [Ejecución del backend](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#5-ejecuci%C3%B3n-del-backend)
6. [Base de datos](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#6-base-de-datos)
7. [API y endpoints](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#7-api-y-endpoints)
8. [Modelos y schemas](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#8-modelos-y-schemas)
9. [Autenticación y seguridad](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#9-autenticaci%C3%B3n-y-seguridad)
10. [Pruebas](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#10-pruebas)
11. [Problemas comunes y soluciones](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#11-problemas-comunes-y-soluciones)
12. [Flujos de trabajo recomendados](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#12-flujos-de-trabajo-recomendados)
13. [Próximos pasos](https://claude.ai/chat/dee0fbc0-b474-4a22-b2fa-c14d22568eef#13-pr%C3%B3ximos-pasos)

## 1. Visión general

El backend de Cunservicios está construido con FastAPI, un moderno framework de Python para APIs web. Utiliza SQLAlchemy como ORM (Object-Relational Mapper) para interactuar con la base de datos y Pydantic para la validación de datos.

**Características principales:**

- API RESTful para la gestión de clientes, facturas y PQRs
- Autenticación mediante JWT
- Base de datos SQL (SQLite en desarrollo, PostgreSQL recomendado para producción)
- Documentación automática de la API

## 2. Requisitos previos

Para trabajar con el backend necesitas:

- Python 3.10 o superior
- Gestor de paquetes pip
- Conocimientos básicos de Python
- (Opcional) Un editor como VS Code con extensiones para Python

## 3. Estructura del proyecto

El backend sigue una estructura organizada por funcionalidad:

```
backend/
├── app/                    # Código principal
│   ├── api/                # Endpoints de la API
│   │   ├── endpoints/      # Endpoints organizados por recurso
│   │   │   ├── users.py    # Endpoints de usuarios
│   │   │   ├── clientes.py # Endpoints de clientes
│   │   │   ├── facturas.py # Endpoints de facturas
│   │   │   └── pqrs.py     # Endpoints de PQRs
│   │   └── dependencies.py # Dependencias compartidas de la API
│   ├── core/               # Configuración central
│   │   ├── config.py       # Configuración y variables de entorno
│   │   └── security.py     # Funciones de seguridad (JWT, hashing)
│   ├── db/                 # Configuración de base de datos
│   │   └── database.py     # Conexión a la base de datos
│   ├── models/             # Modelos SQLAlchemy (tablas de BD)
│   │   ├── user.py         # Modelo de usuario
│   │   ├── cliente.py      # Modelo de cliente
│   │   ├── factura.py      # Modelo de factura
│   │   └── pqr.py          # Modelo de PQR
│   ├── schemas/            # Esquemas Pydantic (validación de datos)
│   │   ├── user.py         # Esquemas de usuario
│   │   ├── cliente.py      # Esquemas de cliente
│   │   ├── factura.py      # Esquemas de factura
│   │   └── pqr.py          # Esquemas de PQR
│   └── main.py             # Punto de entrada de la aplicación
├── tests/                  # Pruebas unitarias e integración
└── requirements.txt        # Dependencias del proyecto
```

**Archivos clave:**

- `app/main.py`: Punto de entrada de la aplicación
- `app/core/config.py`: Configuración y variables de entorno
- `app/db/database.py`: Configuración de la base de datos

## 4. Configuración del entorno

Para configurar el entorno de desarrollo:

14. **Crear y activar entorno virtual**:
    
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate
    
    # Linux/macOS
    python -m venv venv
    source venv/bin/activate
    ```
    
15. **Instalar dependencias**:
    
    ```bash
    pip install -r requirements.txt
    ```
    
16. **Crear archivo .env** (basado en el .env.example):
    
    ```
    DATABASE_URL=sqlite:///./sql_app.db
    SECRET_KEY=tu_clave_secreta_segura_aqui
    BACKEND_CORS_ORIGINS=["http://localhost:3000"]
    ```
    

## 5. Ejecución del backend

Para ejecutar el backend en modo desarrollo:

```bash
# Opción 1: Directamente con uvicorn
uvicorn app.main:app --reload --port 8000

# Opción 2: Usando la configuración de VS Code
# Simplemente ejecuta desde la barra de depuración "Python: FastAPI"
```

Una vez en ejecución, puedes acceder a:

- API: http://localhost:8000
- Documentación Swagger: http://localhost:8000/docs
- Documentación ReDoc: http://localhost:8000/redoc

## 6. Base de datos

El backend utiliza SQLAlchemy como ORM y SQLite como base de datos por defecto.

**Aspectos importantes:**

- **Conexión a la BD**: Configurada en `app/db/database.py`
- **Modelos**: Definidos en `app/models/`
- **Inicialización**: La base de datos se crea automáticamente en el primer inicio
- **Migraciones**: Para proyectos más grandes, se recomienda usar Alembic

**Para cambiar a PostgreSQL o MySQL:** Modifica la URL de conexión en el archivo `.env`:

```
DATABASE_URL=postgresql://usuario:contraseña@localhost/cunservicios
```

También deberás eliminar el parámetro `connect_args={"check_same_thread": False}` en `database.py`, ya que es específico de SQLite.

## 7. API y endpoints

La API sigue principios RESTful. Los endpoints están organizados por recursos:

### Usuarios (`/api/users`)

- `GET /api/users/`: Listar usuarios
- `POST /api/users/`: Crear usuario

### Clientes (`/api/clientes`)

- `GET /api/clientes/`: Listar clientes
- `GET /api/clientes/{numero_cuenta}`: Obtener cliente por número de cuenta
- `POST /api/clientes/`: Crear cliente

### Facturas (`/api/facturas`)

- `GET /api/facturas/`: Listar facturas
- `GET /api/facturas/{numero_factura}`: Obtener factura por número
- `POST /api/facturas/`: Crear factura

### PQRs (`/api/pqrs`)

- `GET /api/pqrs/`: Listar PQRs
- `GET /api/pqrs/{radicado}`: Obtener PQR por radicado
- `POST /api/pqrs/`: Crear PQR

**Uso de la API**: Todos los endpoints devuelven respuestas JSON y aceptan parámetros según lo definido en los schemas.

## 8. Modelos y schemas

FastAPI utiliza dos tipos de objetos para la definición de datos:

### Modelos SQLAlchemy

- Ubicados en `app/models/`
- Definen la estructura de las tablas en la base de datos
- Ejemplo (`app/models/cliente.py`):
    
    ```python
    class Cliente(Base):    __tablename__ = "clientes"        id = Column(Integer, primary_key=True, index=True)    nombre = Column(String)    direccion = Column(String)    telefono = Column(String)    correo = Column(String)    numero_cuenta = Column(String, unique=True, index=True)    estrato = Column(Integer)        facturas = relationship("Factura", back_populates="cliente")
    ```
    

### Schemas Pydantic

- Ubicados en `app/schemas/`
- Usados para validación de datos de entrada/salida de la API
- Ejemplo (`app/schemas/cliente.py`):
    
    ```python
    class ClienteBase(BaseModel):    nombre: str    direccion: str    telefono: str    correo: EmailStr    numero_cuenta: str    estrato: intclass ClienteCreate(ClienteBase):    passclass Cliente(ClienteBase):    id: int    facturas: Optional[List[Factura]] = []    class Config:        orm_mode = True
    ```
    

La separación entre modelos y schemas permite una validación robusta y una interfaz de API bien definida.

## 9. Autenticación y seguridad

El sistema utiliza JWT (JSON Web Tokens) para autenticación:

- **Generación de tokens**: En `app/core/security.py`
- **Protección de endpoints**: Implementada mediante dependencias de FastAPI

Para proteger un endpoint:

```python
from fastapi import Depends
from app.api.dependencies import get_current_user

@router.get("/protected-endpoint")
def protected_endpoint(current_user = Depends(get_current_user)):
    return {"message": "Esta ruta está protegida"}
```

## 10. Pruebas

Las pruebas se ubican en el directorio `tests/`. Para ejecutarlas:

```bash
# Ejecutar todas las pruebas
pytest

# Con cobertura
pytest --cov=app

# Pruebas específicas
pytest tests/api/test_usuarios.py
```

## 11. Problemas comunes y soluciones

### Error de conexión a la base de datos

```
Error: sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) unable to open database file
```

**Solución**: Verifica que la ruta de la base de datos en `DATABASE_URL` sea correcta y que el directorio exista.

### Errores de CORS

```
Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solución**: Asegúrate de que el origen del frontend esté incluido en `BACKEND_CORS_ORIGINS` en el archivo `.env`.

### Errores de dependencias

```
ImportError: No module named 'some_module'
```

**Solución**: Verifica que todas las dependencias estén instaladas: `pip install -r requirements.txt`

## 12. Flujos de trabajo recomendados

### Añadir un nuevo endpoint

17. Define el schema en `app/schemas/` si es necesario
18. Añade el endpoint en el archivo correspondiente en `app/api/endpoints/`
19. Si es un nuevo recurso, registra el router en `app/main.py`

### Ejemplo: Añadir un endpoint para buscar facturas por cliente

```python
# En app/api/endpoints/facturas.py
@router.get("/cliente/{cliente_id}", response_model=List[schemas.Factura])
def read_facturas_by_cliente(
    cliente_id: int,
    db: Session = Depends(get_db)
):
    # Lógica para obtener facturas por cliente_id
    return db.query(Factura).filter(Factura.cliente_id == cliente_id).all()
```

### Modificar un modelo (base de datos)

20. Actualiza el modelo en `app/models/`
21. Si usas migraciones, genera una nueva migración con Alembic
22. Si no usas migraciones, tendrás que recrear la base de datos o modificarla manualmente

## 13. Próximos pasos

Para seguir profundizando en el backend:

23. **Implementar lógica de negocio**: Completa las funciones en los endpoints (están parcialmente implementadas)
24. **Añadir migraciones**: Integra Alembic para gestionar cambios en la base de datos
25. **Mejorar autenticación**: Implementa registro, inicio de sesión y gestión de tokens
26. **Expandir pruebas**: Añade más pruebas unitarias y de integración
27. **Logging**: Configura un sistema de logging para facilitar la depuración
28. **Documentación específica**: Mejora la documentación de los endpoints con ejemplos

## Conclusiones

Este backend proporciona una base sólida para la aplicación Cunservicios. Está construido con tecnologías modernas como FastAPI y SQLAlchemy, siguiendo buenas prácticas de desarrollo como la separación de responsabilidades y el uso de schemas para validación.

Para sacar el máximo provecho, familiarízate con la documentación oficial de:

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [Pydantic](https://pydantic-docs.helpmanual.io/)

Estos recursos te ayudarán a entender mejor los conceptos y patrones utilizados en el proyecto.