from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, materials, tokens
from app.config import get_settings

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
# Allow Vercel preview deployments
cors_origins.extend([
    "https://*.vercel.app",
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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

