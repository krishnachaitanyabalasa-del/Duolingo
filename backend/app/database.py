from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Create engine for SQLite
# connect_args={"check_same_thread": False} is required for SQLite in multithreaded FastAPI applications
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for providing database sessions per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
