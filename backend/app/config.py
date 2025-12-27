from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    SECRET_KEY: str = "your-secret-key-change-this"
    DATABASE_URL: str = "sqlite:///./app.db"
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60  # 30 days
    
    # Generation password to protect API usage
    GENERATION_PASSWORD: str = "change-this-password"
    
    # CORS settings for production
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    class Config:
        env_file = ".env"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Convert CORS_ORIGINS string to list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache()
def get_settings():
    return Settings()
