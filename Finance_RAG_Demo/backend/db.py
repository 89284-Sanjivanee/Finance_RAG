import sqlite3
from pathlib import Path

DB_PATH = "rag.db"

def get_connection():
    return sqlite3.connect(DB_PATH)

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chunk TEXT,
            embedding BLOB
        )
    """)

    conn.commit()
    conn.close()
