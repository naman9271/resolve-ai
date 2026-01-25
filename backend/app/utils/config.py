"""
Application configuration using Pydantic Settings
"""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache

# Get the backend directory path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App Settings
    APP_NAME: str = "Resolve AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database - Use absolute path
    DATABASE_URL: str = f"sqlite+aiosqlite:///{os.path.join(BACKEND_DIR, 'app', 'db', 'resolve_ai.db')}"
    
    # JWT Settings
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    
    # Frontend URL (for CORS and redirects)
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Supabase/S3 Storage (for Resource Hub)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
