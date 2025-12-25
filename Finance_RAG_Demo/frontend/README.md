# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




























----------- Finance RAG Demo ------------

This project is a small, end-to-end Retrieval-Augmented Generation (RAG) demo built as part of a take-home assignment.

#The goal is to demonstrate:
-Clear thinking
-Correct RAG fundamentals
-Clean, readable code
-Ability to ship a working system under time constraints

# The application allows users to:
-Ingest financial text or documents (PDF / CSV)
-Store and embed content locally
-Ask questions grounded strictly in the ingested data
-Receive answers with citations to the source text

# Tech Stack

## Backend
-Python
-FastAPI
-SQLite
-NumPy
-OpenAI Embeddings + LLM
-Frontend
-React (Vite)
-Fetch API
-Minimal inline styling (focus on functionality)

## Other
-Runs fully locally
-No Docker

# Project Structure
Finance_RAG/
├── backend/
│   ├── main.py
│   ├── db.sqlite
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md

## Setup Instructions
### Backend Setup
-cd backend
-python -m venv venv
(venv\Scripts\activate   
pip install -r requirements.txt
Set your OpenAI API key:
set OPENAI_API_KEY=your_api_key_here)  


Run the backend:
-uvicorn main:app --reload

## Backend runs at:
http://127.0.0.1:8000


## Frontend Setup
cd frontend
npm install
npm run dev

## Frontend runs at:
http://localhost:5173

## Document Ingestion API
### Ingest Raw Financial Text
curl -X POST http://127.0.0.1:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Revenue increased by 20% in Q3 due to strong demand."
  }'

OR 

iwr http://localhost:8000/ingest -Method POST `
-Headers @{ "Content-Type"="application/json" } `
-Body '{ "content":"Revenue increased by 20% in Q3 due to strong demand." }'



### Ingest PDF or CSV
curl -X POST http://127.0.0.1:8000/ingest/file \
  -F "file=@sample_financials.pdf"



Text is extracted

Split into chunks

Embedded

Stored persistently in SQLite

## Query API
curl "http://127.0.0.1:8000/query?question=What happened to revenue?"

OR

iwr "http://localhost:8000/query?question=What happened to revenue?"


Sample Response
{
  "answer": "Revenue increased by 20% in Q3 due to strong demand [1].",
  "sources": {
    "1": "Revenue increased by 20% in Q3 due to strong demand."
  }
}

# How It Works (RAG Flow)

## Ingestion
--Input text is split into chunks
--Each chunk is embedded using OpenAI embeddings
--Embeddings are stored efficiently using NumPy + SQLite

## Retrieval
--User query is embedded
--Cosine similarity is computed against stored embeddings
--Top-K relevant chunks are selected

## Generation
--Retrieved chunks are injected as context
--LLM is instructed to answer strictly from provided context
--Citations are added for each referenced chunk

## Error Handling
--The API gracefully handles:
--Empty database
--No relevant chunks found
--Invalid input
--File parsing failures

Errors return meaningful messages instead of crashing.

# Frontend Experience
-Upload PDF/CSV files
-Ask finance-related questions
-View grounded answers
-See citations with exact source snippets


