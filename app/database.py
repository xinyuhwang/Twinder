from sqlalchemy import text
from sqlmodel import SQLModel, Session, create_engine

from app.config import settings

engine = create_engine(settings.database_url, echo=False)


def create_db():
    SQLModel.metadata.create_all(engine)
    _migrate_db()


def _migrate_db():
    """Add new nullable columns to existing tables (SQLite ALTER TABLE migration)."""
    new_columns = [
        ("room", "match_card", "TEXT"),
        ("room", "match_card_call_id", "TEXT"),
        ("user", "dat_score", "FLOAT"),
        ("user", "dat_words", "TEXT"),
        ("user", "age", "INTEGER"),
    ]
    with engine.connect() as conn:
        for table, column, col_type in new_columns:
            try:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"))
                conn.commit()
            except Exception:
                pass  # column already exists


def get_session():
    with Session(engine) as session:
        yield session
