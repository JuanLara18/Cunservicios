import json
import re
from typing import Any

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

    API_PREFIX: str = "/api"
    PROJECT_NAME: str = "Cunservicios API"
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    ENV: str = "development"
    DEBUG: bool = True

    # Database settings
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800

    # JWT settings
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Platform settings
    DEFAULT_TENANT_ID: str = "public"
    AUTO_CREATE_TABLES: bool = True
    ENABLE_SEED_DATA: bool = False

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value: Any) -> str:
        if not value:
            return "sqlite:///./sql_app.db"
        if isinstance(value, str) and value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql://", 1)
        return str(value)

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Any) -> list[str]:
        if isinstance(value, list):
            return value

        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return []
            if stripped == "*":
                return ["*"]
            if stripped.startswith("["):
                parsed = json.loads(stripped)
                if isinstance(parsed, list):
                    return [str(origin).strip() for origin in parsed if str(origin).strip()]
            return [origin.strip() for origin in stripped.split(",") if origin.strip()]

        raise ValueError("BACKEND_CORS_ORIGINS debe ser una lista o string")

    @field_validator("ACCESS_TOKEN_EXPIRE_MINUTES")
    @classmethod
    def validate_expiration(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES debe ser mayor que 0")
        return value

    @field_validator("DB_POOL_SIZE", "DB_MAX_OVERFLOW", "DB_POOL_TIMEOUT", "DB_POOL_RECYCLE")
    @classmethod
    def validate_db_pool_values(cls, value: int) -> int:
        if value < 0:
            raise ValueError("Los valores de pool de base de datos no pueden ser negativos")
        return value

    @field_validator("DEFAULT_TENANT_ID")
    @classmethod
    def validate_default_tenant(cls, value: str) -> str:
        tenant = value.strip().lower()
        if not re.fullmatch(r"[a-z0-9][a-z0-9_-]{1,63}", tenant):
            raise ValueError("DEFAULT_TENANT_ID inválido")
        return tenant

    @model_validator(mode="after")
    def validate_production_security(self) -> "Settings":
        if self.ENV == "production":
            if self.SECRET_KEY in {"your-secret-key-here", "change-me-in-production"}:
                raise ValueError("Configura un SECRET_KEY seguro en producción")
            if "*" in self.BACKEND_CORS_ORIGINS:
                raise ValueError("No uses CORS wildcard en producción")
        return self

    @property
    def is_development(self) -> bool:
        return self.ENV == "development"

    @property
    def is_production(self) -> bool:
        return self.ENV == "production"


settings = Settings()