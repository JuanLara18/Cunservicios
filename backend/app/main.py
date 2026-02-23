from contextlib import asynccontextmanager
import logging

import app.models  # noqa: F401
from app.api.endpoints import auth, clientes, facturas, pqrs, users
from app.api.tenant import TENANT_HEADER_NAME, normalize_tenant_id
from app.core.config import settings
from app.db.database import Base, engine, get_db
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.AUTO_CREATE_TABLES:
        Base.metadata.create_all(bind=engine)

    if settings.ENABLE_SEED_DATA:
        db = next(get_db())
        try:
            from app.db.init_db import init_db

            init_db(db)
        except Exception:
            logger.exception("Error al inicializar datos semilla")
        finally:
            db.close()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para la página web de Cunservicios",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def append_tenant_header(request: Request, call_next):
    response = await call_next(request)
    try:
        response.headers[TENANT_HEADER_NAME] = normalize_tenant_id(
            request.headers.get(TENANT_HEADER_NAME)
        )
    except Exception:
        response.headers[TENANT_HEADER_NAME] = settings.DEFAULT_TENANT_ID
    return response


@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Cunservicios"}


@app.get("/healthz")
async def healthcheck():
    return {"status": "ok", "environment": settings.ENV}


app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(users.router, prefix=settings.API_PREFIX)
app.include_router(clientes.router, prefix=settings.API_PREFIX)
app.include_router(facturas.router, prefix=settings.API_PREFIX)
app.include_router(pqrs.router, prefix=settings.API_PREFIX)


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