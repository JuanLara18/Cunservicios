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
    ALLOWED_HOSTS: list[str] = ["localhost", "127.0.0.1", "testserver"]
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
    AUTH_MAX_FAILED_ATTEMPTS: int = 5
    AUTH_LOCKOUT_MINUTES: int = 15

    # Platform settings
    DEFAULT_TENANT_ID: str = "public"
    AUTO_CREATE_TABLES: bool = True
    ENABLE_SEED_DATA: bool = False
    DEV_SEED_ADMIN_EMAIL: str = "admin.dev@cunservicios.local"
    DEV_SEED_ADMIN_PASSWORD: str | None = None
    DEV_SEED_PORTAL_EMAIL: str = "portal.dev@cunservicios.local"
    DEV_SEED_PORTAL_PASSWORD: str | None = None
    ENFORCE_AUTH_ON_DATA_ENDPOINTS: bool = True
    ENABLE_HTTPS_REDIRECT: bool = False
    ENABLE_SECURITY_HEADERS: bool = True
    SECURITY_HSTS_SECONDS: int = 31536000
    SECURITY_REFERRER_POLICY: str = "strict-origin-when-cross-origin"
    SECURITY_FRAME_OPTIONS: str = "DENY"
    SECURITY_CONTENT_SECURITY_POLICY: str = (
        "default-src 'none'; frame-ancestors 'none'; base-uri 'none';"
    )

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

    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def parse_allowed_hosts(cls, value: Any) -> list[str]:
        if isinstance(value, list):
            return [str(host).strip() for host in value if str(host).strip()]

        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return []
            if stripped.startswith("["):
                parsed = json.loads(stripped)
                if isinstance(parsed, list):
                    return [str(host).strip() for host in parsed if str(host).strip()]
            return [host.strip() for host in stripped.split(",") if host.strip()]

        raise ValueError("ALLOWED_HOSTS debe ser una lista o string")

    @field_validator("ACCESS_TOKEN_EXPIRE_MINUTES")
    @classmethod
    def validate_expiration(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES debe ser mayor que 0")
        return value

    @field_validator("AUTH_MAX_FAILED_ATTEMPTS", "AUTH_LOCKOUT_MINUTES")
    @classmethod
    def validate_auth_limits(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Los parámetros de seguridad de autenticación deben ser mayores que 0")
        return value

    @field_validator("SECURITY_HSTS_SECONDS")
    @classmethod
    def validate_hsts_seconds(cls, value: int) -> int:
        if value < 0:
            raise ValueError("SECURITY_HSTS_SECONDS no puede ser negativo")
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

    @field_validator("DEV_SEED_ADMIN_EMAIL", "DEV_SEED_PORTAL_EMAIL")
    @classmethod
    def normalize_seed_emails(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not normalized:
            raise ValueError("Los correos de seed no pueden ser vacíos")
        return normalized

    @field_validator("DEV_SEED_ADMIN_PASSWORD", "DEV_SEED_PORTAL_PASSWORD")
    @classmethod
    def validate_seed_passwords(cls, value: str | None) -> str | None:
        if value is None:
            return None
        trimmed = value.strip()
        if not trimmed:
            return None

        has_upper = any(char.isupper() for char in trimmed)
        has_lower = any(char.islower() for char in trimmed)
        has_digit = any(char.isdigit() for char in trimmed)
        has_symbol = any(not char.isalnum() for char in trimmed)
        if len(trimmed) < 12 or not (has_upper and has_lower and has_digit and has_symbol):
            raise ValueError(
                "Las contraseñas de seed deben tener mínimo 12 caracteres e incluir mayúsculas, "
                "minúsculas, números y símbolos."
            )
        return trimmed

    @model_validator(mode="after")
    def validate_production_security(self) -> "Settings":
        if self.ENABLE_SEED_DATA and self.ENV == "production":
            raise ValueError("ENABLE_SEED_DATA no puede estar activo en producción")

        if self.ENABLE_SEED_DATA and self.ENV != "production":
            if not self.DEV_SEED_ADMIN_PASSWORD or not self.DEV_SEED_PORTAL_PASSWORD:
                raise ValueError(
                    "Configura DEV_SEED_ADMIN_PASSWORD y DEV_SEED_PORTAL_PASSWORD "
                    "para habilitar ENABLE_SEED_DATA en desarrollo."
                )

        if self.ENV == "production":
            if self.SECRET_KEY in {"your-secret-key-here", "change-me-in-production"}:
                raise ValueError("Configura un SECRET_KEY seguro en producción")
            if "*" in self.BACKEND_CORS_ORIGINS:
                raise ValueError("No uses CORS wildcard en producción")
            if self.DEBUG:
                raise ValueError("DEBUG debe estar deshabilitado en producción")
            if self.DATABASE_URL.startswith("sqlite"):
                raise ValueError("Usa PostgreSQL (Cloud SQL) en producción")
            if not self.ENABLE_HTTPS_REDIRECT:
                raise ValueError("ENABLE_HTTPS_REDIRECT debe estar activo en producción")
            if not self.ENABLE_SECURITY_HEADERS:
                raise ValueError("ENABLE_SECURITY_HEADERS debe estar activo en producción")
            if not self.ENFORCE_AUTH_ON_DATA_ENDPOINTS:
                raise ValueError("ENFORCE_AUTH_ON_DATA_ENDPOINTS debe estar activo en producción")
            if not self.ALLOWED_HOSTS:
                raise ValueError("Configura ALLOWED_HOSTS en producción")
        return self

    @property
    def is_development(self) -> bool:
        return self.ENV == "development"

    @property
    def is_production(self) -> bool:
        return self.ENV == "production"


settings = Settings()