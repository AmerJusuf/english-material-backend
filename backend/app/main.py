from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, materials, tokens
from app.config import get_settings
from app.llm_service import llm_service

# Create database tables
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title="English Class Material Generator API",
    description="API for generating English learning materials using AI",
    version="1.0.0"
)

# CORS middleware - supports both development and production
cors_origins = settings.cors_origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,  # Specific domains from CORS_ORIGINS env var
    allow_origin_regex=r"https://.*\.vercel\.app",  # Matches all Vercel domains (preview + production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(materials.router, prefix="/api")
app.include_router(tokens.router, prefix="/api")


@app.get("/")
def read_root():
    return {
        "message": "English Class Material Generator API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/debug/api-keys")
def debug_api_keys():
    """Debug endpoint to check if API keys are loaded (for development only)"""
    import os
    from pathlib import Path
    
    env_path = Path(__file__).parent.parent / ".env"
    
    return {
        "env_file_exists": env_path.exists(),
        "env_file_path": str(env_path),
        "openai_key_set": bool(settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY.strip()) > 10),
        "openai_key_length": len(settings.OPENAI_API_KEY.strip()) if settings.OPENAI_API_KEY else 0,
        "openai_key_preview": settings.OPENAI_API_KEY[:10] + "..." if settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY) > 10 else "Not set",
        "llm_service_openai_initialized": llm_service.openai_client is not None,
    }

