from sqlalchemy import create_engine, inspect, text
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


def init_and_migrate_db():
    """Ensures tables are created and missing columns on existing SQLite tables are added."""
    Base.metadata.create_all(bind=engine)

    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        if "users" in tables:
            existing_cols = {c["name"] for c in inspector.get_columns("users")}
            cols_to_add = [
                ("display_name", "VARCHAR"),
                ("avatar_id", "VARCHAR DEFAULT 'avatar_01'"),
                ("bio", "VARCHAR"),
                ("joined_date", "VARCHAR DEFAULT 'Joined April 2025'"),
                ("league", "VARCHAR DEFAULT 'Amethyst'"),
                ("top_three_finishes", "INTEGER DEFAULT 7"),
                ("following_count", "INTEGER DEFAULT 0"),
                ("followers_count", "INTEGER DEFAULT 1"),
            ]
            with engine.connect() as conn:
                for col_name, col_type in cols_to_add:
                    if col_name not in existing_cols:
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                conn.commit()
    except Exception as e:
        print(f"Migration check notice: {e}")


def get_db():
    """Dependency for providing database sessions per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
