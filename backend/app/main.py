from app.api.endpoints import auth, clientes, facturas, pqrs, users
from app.db.database import Base, engine, get_db
from app.static import setup_static_files
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cunservicios API",
    description="API para la página web de Cunservicios",
    version="0.1.0"
)

# Configurar CORS
origins = [
    "http://localhost:3000",  # Frontend de desarrollo
    "http://localhost:8080",  # Posible puerto alternativo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Reemplaza "*" con orígenes específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Cunservicios"}

# Importar y registrar routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(clientes.router, prefix="/api")
app.include_router(facturas.router, prefix="/api")
app.include_router(pqrs.router, prefix="/api")

# Inicializar datos de prueba
@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    try:
        from app.db.init_db import init_db
        init_db(db)
    except Exception as e:
        print(f"Error al inicializar la base de datos: {e}")
    finally:
        db.close()
        
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )
    
    
if __name__ == "__main__":
    import os

    import uvicorn
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
    
    if os.environ.get("ENV", "development") == "production":
        setup_static_files(app)