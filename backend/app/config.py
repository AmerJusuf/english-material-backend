from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path
import os


# Find .env file - check backend/ directory first, then current directory
_env_path = Path(__file__).parent.parent / ".env"  # backend/.env
if not _env_path.exists():
    _env_path = Path(".env")  # Fallback to current directory

# Debug: Print which .env file is being used
if _env_path.exists():
    print(f"Loading .env file from: {_env_path.absolute()}")
else:
    print(f"Warning: .env file not found at {_env_path.absolute()}")


class Settings(BaseSettings):
    SECRET_KEY: str = "your-secret-key-change-this"
    DATABASE_URL: str = "sqlite:///./app.db"
    OPENAI_API_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60  # 30 days
    
    # Generation password to protect API usage
    GENERATION_PASSWORD: str = "change-this-password"
    
    # CORS settings for production
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    class Config:
        # Look for .env file in backend directory
        env_file = str(_env_path)
        env_file_encoding = 'utf-8'
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Convert CORS_ORIGINS string to list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache()
def get_settings():
    return Settings()
