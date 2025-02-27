
from pydantic import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Cunservicios API"
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

