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


def _add_missing_columns(conn, inspector, table: str, cols_to_add: list[tuple[str, str]]):
    """Adds any missing columns to an existing table (SQLite ALTER TABLE ADD COLUMN)."""
    if table not in inspector.get_table_names():
        return
    existing_cols = {c["name"] for c in inspector.get_columns(table)}
    for col_name, col_type in cols_to_add:
        if col_name not in existing_cols:
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col_name} {col_type}"))


def init_and_migrate_db():
    """Ensures tables are created and missing columns on existing SQLite tables are added."""
    Base.metadata.create_all(bind=engine)

    try:
        inspector = inspect(engine)
        with engine.connect() as conn:
            _add_missing_columns(conn, inspector, "users", [
                ("firebase_uid", "VARCHAR"),
                ("display_name", "VARCHAR"),
                ("avatar_id", "VARCHAR DEFAULT 'avatar_01'"),
                ("bio", "VARCHAR"),
                ("joined_date", "VARCHAR DEFAULT 'Joined April 2025'"),
                ("league", "VARCHAR DEFAULT 'Amethyst'"),
                ("top_three_finishes", "INTEGER DEFAULT 0"),
                ("following_count", "INTEGER DEFAULT 0"),
                ("followers_count", "INTEGER DEFAULT 0"),
            ])
            _add_missing_columns(conn, inspector, "user_lesson_progress", [
                ("status", "VARCHAR DEFAULT 'LOCKED'"),
                ("score", "INTEGER DEFAULT 0"),
            ])
            _add_missing_columns(conn, inspector, "achievements", [
                ("reward_xp", "INTEGER NOT NULL DEFAULT 0"),
                ("reward_gems", "INTEGER NOT NULL DEFAULT 0"),
            ])
            _add_missing_columns(conn, inspector, "user_achievements", [
                ("reward_awarded", "BOOLEAN NOT NULL DEFAULT 0"),
                ("reward_awarded_at", "DATETIME"),
            ])
            conn.commit()

            # Deduplicate user_lesson_progress rows before applying unique index
            if "user_lesson_progress" in inspector.get_table_names():
                try:
                    conn.execute(text("""
                        DELETE FROM user_lesson_progress
                        WHERE id NOT IN (
                            SELECT id FROM (
                                SELECT id, ROW_NUMBER() OVER (
                                    PARTITION BY user_id, lesson_id
                                    ORDER BY is_completed DESC, attempts_count DESC, id DESC
                                ) as rn
                                FROM user_lesson_progress
                            ) WHERE rn = 1
                        )
                    """))
                    conn.execute(text(
                        "CREATE UNIQUE INDEX IF NOT EXISTS uq_user_lesson_progress_idx "
                        "ON user_lesson_progress (user_id, lesson_id)"
                    ))
                    conn.commit()
                except Exception as lp_err:
                    print(f"Migration notice (user_lesson_progress deduplication/index): {lp_err}")

            # Deduplicate user_skill_progress rows before applying unique index
            if "user_skill_progress" in inspector.get_table_names():
                try:
                    conn.execute(text("""
                        DELETE FROM user_skill_progress
                        WHERE id NOT IN (
                            SELECT id FROM (
                                SELECT id, ROW_NUMBER() OVER (
                                    PARTITION BY user_id, skill_id
                                    ORDER BY (CASE status WHEN 'COMPLETED' THEN 3 WHEN 'IN_PROGRESS' THEN 2 WHEN 'AVAILABLE' THEN 1 ELSE 0 END) DESC, crown_level DESC, id DESC
                                ) as rn
                                FROM user_skill_progress
                            ) WHERE rn = 1
                        )
                    """))
                    conn.execute(text(
                        "CREATE UNIQUE INDEX IF NOT EXISTS uq_user_skill_progress_idx "
                        "ON user_skill_progress (user_id, skill_id)"
                    ))
                    conn.commit()
                except Exception as sp_err:
                    print(f"Migration notice (user_skill_progress deduplication/index): {sp_err}")

            # Deduplicate user_unit_progress rows before applying unique index
            if "user_unit_progress" in inspector.get_table_names():
                try:
                    conn.execute(text("""
                        DELETE FROM user_unit_progress
                        WHERE id NOT IN (
                            SELECT id FROM (
                                SELECT id, ROW_NUMBER() OVER (
                                    PARTITION BY user_id, unit_id
                                    ORDER BY (CASE status WHEN 'COMPLETED' THEN 3 WHEN 'IN_PROGRESS' THEN 2 WHEN 'AVAILABLE' THEN 1 ELSE 0 END) DESC, progress_percentage DESC, id DESC
                                ) as rn
                                FROM user_unit_progress
                            ) WHERE rn = 1
                        )
                    """))
                    conn.execute(text(
                        "CREATE UNIQUE INDEX IF NOT EXISTS uq_user_unit_progress_idx "
                        "ON user_unit_progress (user_id, unit_id)"
                    ))
                    conn.commit()
                except Exception as up_err:
                    print(f"Migration notice (user_unit_progress deduplication/index): {up_err}")

            # Guarantee one progress row per (user, achievement) on pre-existing databases.
            if "user_achievements" in inspector.get_table_names():
                try:
                    conn.execute(text(
                        "CREATE UNIQUE INDEX IF NOT EXISTS uq_user_achievement_idx "
                        "ON user_achievements (user_id, achievement_id)"
                    ))
                    conn.commit()
                except Exception as idx_err:
                    print(f"Migration notice (unique index skipped): {idx_err}")
    except Exception as e:
        print(f"Migration check notice: {e}")


def get_db():
    """Dependency for providing database sessions per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
