# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.api.endpoints import users, clientes, facturas, pqrs

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cunservicios API",
    description="API para la página web de Cunservicios",
    version="0.1.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, limitar a dominio específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Cunservicios"}

# Importar y registrar routers
app.include_router(users.router, prefix="/api")
app.include_router(clientes.router, prefix="/api")
app.include_router(facturas.router, prefix="/api")
app.include_router(pqrs.router, prefix="/api")