from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3

from fastapi.middleware.cors import CORSMiddleware


from fastapi import UploadFile, File
from pypdf import PdfReader
import pandas as pd
import io



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DB_NAME = "rag.db"


# ---------- DATABASE INIT ----------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


init_db()


def extract_text_from_file(file: UploadFile) -> str:
    if file.filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    elif file.filename.endswith(".csv"):
        df = pd.read_csv(file.file)
        return df.to_string(index=False)

    else:
        raise ValueError("Unsupported file type")


# ---------- REQUEST MODEL ----------
class IngestRequest(BaseModel):
    content: str


# ---------- INGEST ----------
@app.post("/ingest")
def ingest(req: IngestRequest):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO documents (content) VALUES (?)",
        (req.content,)
    )

    conn.commit()
    conn.close()

    return {"status": "Document ingested"}


@app.post("/ingest/file")
def ingest_file(file: UploadFile = File(...)):
    try:
        text = extract_text_from_file(file)

        if not text.strip():
            raise HTTPException(status_code=400, detail="File is empty")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO documents (content) VALUES (?)",
            (text,)
        )

        conn.commit()
        conn.close()

        return {
            "message": "File ingested successfully",
            "filename": file.filename
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ---------- QUERY ----------
@app.get("/query")
def query(question: str):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT content FROM documents ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"answer": "No documents available"}

    return {
        "question": question,
        "answer": row[0]
    }
