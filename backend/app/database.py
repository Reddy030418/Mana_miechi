from pathlib import Path
import sqlite3

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "mana_mirchi.db"


def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS quote_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'new',
                email_status TEXT NOT NULL DEFAULT 'not_configured',
                email_error TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        columns = {
            row["name"]
            for row in connection.execute("PRAGMA table_info(quote_requests)").fetchall()
        }
        if "email_status" not in columns:
            connection.execute(
                "ALTER TABLE quote_requests ADD COLUMN email_status TEXT NOT NULL DEFAULT 'not_configured'"
            )
        if "email_error" not in columns:
            connection.execute("ALTER TABLE quote_requests ADD COLUMN email_error TEXT")
        connection.commit()
