import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.decision import router as decision_router
from app.utils.logger import logger

from pathlib import Path
# Load environment configuration
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
load_dotenv()

app = FastAPI(
    title="AI Business Decision Assistant API",
    description="Decoupled high-performance FastAPI backend powered by Google Gemini 3.8 Flash for executive decision analysis.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:4173",
]

env_frontend = os.getenv("FRONTEND_URL")
if env_frontend:
    # Support comma-separated origins if provided
    for origin in env_frontend.split(","):
        cleaned = origin.strip()
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

logger.info(f"Configuring CORS with origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Register routes
app.include_router(decision_router)


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint to verify backend operational readiness."""
    has_key = bool(os.getenv("GEMINI_API_KEY"))
    model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    return {
        "status": "healthy",
        "service": "AI Business Decision Assistant Backend",
        "version": "2.0.0",
        "gemini_model": model,
        "gemini_configured": has_key,
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "AI Business Decision Assistant API is active.",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing your request."}
    )
