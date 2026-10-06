from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed.seed_data import seed_database
from app.routers import (
    course_router,
    user_router,
    progress_router,
    lesson_router,
    gamification_router,
    achievement_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager to handle DB initialization and auto-seeding on startup."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Fullstack Duolingo Clone SDE Assignment Backend API with Python, FastAPI, SQLite, and SQLAlchemy.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler for Database Errors
@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "A database error occurred. Please try again later."},
    )


# Root endpoint
@app.get("/", tags=["Health"])
def root():
    return {
        "name": settings.PROJECT_NAME,
        "status": "online",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
    }


# Include Routers under /api
api_prefix = settings.API_V1_STR

app.include_router(course_router, prefix=api_prefix)
app.include_router(user_router, prefix=api_prefix)
app.include_router(progress_router, prefix=api_prefix)
app.include_router(lesson_router, prefix=api_prefix)
app.include_router(gamification_router, prefix=api_prefix)
app.include_router(achievement_router, prefix=api_prefix)
