import os
from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Cunservicios API"
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    ENV: str = "development"
    DEBUG: bool = True
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    @property
    def is_development(self) -> bool:
        return self.ENV == "development"
    
    @property
    def is_production(self) -> bool:
        return self.ENV == "production"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()