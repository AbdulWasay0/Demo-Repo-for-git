from pathlib import Path
from typing import List
import os
import re
import hashlib

import chromadb
import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


APP_DIR = Path(__file__).resolve().parent
load_dotenv(APP_DIR / ".env")
KNOWLEDGE_PATH = APP_DIR / "knowledge_base" / "hollowfall.txt"
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "hollowfall_knowledge")
EMBEDDING_SIZE = 384
DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://demo-repo-for-git.vercel.app",
]
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", ",".join(DEFAULT_ALLOWED_ORIGINS)).split(",")
    if origin.strip()
]

app = FastAPI(title="Hollow Fall Local Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    source: str


def load_chunks() -> List[str]:
    text = KNOWLEDGE_PATH.read_text(encoding="utf-8")
    return [chunk.strip() for chunk in text.split("\n\n") if chunk.strip()]


CHUNKS = load_chunks()
CHROMA_COLLECTION_CLIENT = None


def embed_text(text: str) -> list[float]:
    vector = [0.0] * EMBEDDING_SIZE
    words = re.findall(r"[a-z0-9]+", text.lower())
    if not words:
        return vector

    for word in words:
        index = int(hashlib.sha256(word.encode("utf-8")).hexdigest(), 16) % EMBEDDING_SIZE
        vector[index] += 1.0

    length = sum(value * value for value in vector) ** 0.5
    if length == 0:
        return vector
    return [value / length for value in vector]


def get_chroma_collection():
    global CHROMA_COLLECTION_CLIENT
    if CHROMA_COLLECTION_CLIENT is not None:
        return CHROMA_COLLECTION_CLIENT

    api_key = os.getenv("CHROMA_API_KEY")
    tenant = os.getenv("CHROMA_TENANT")
    database = os.getenv("CHROMA_DATABASE")

    if not api_key or not tenant or not database:
        return None

    client = chromadb.CloudClient(
        api_key=api_key,
        tenant=tenant,
        database=database,
    )
    CHROMA_COLLECTION_CLIENT = client.get_or_create_collection(CHROMA_COLLECTION)
    return CHROMA_COLLECTION_CLIENT


def score_chunk(question: str, chunk: str) -> int:
    question_words = {
        word.strip(".,?!:;()[]\"'").lower()
        for word in question.split()
        if len(word.strip(".,?!:;()[]\"'")) > 2
    }
    chunk_lower = chunk.lower()
    return sum(1 for word in question_words if word in chunk_lower)


def retrieve_context(question: str, limit: int = 4) -> str:
    chroma_context = retrieve_chroma_context(question, limit)
    if chroma_context:
        return chroma_context

    ranked = sorted(
        ((score_chunk(question, chunk), chunk) for chunk in CHUNKS),
        key=lambda item: item[0],
        reverse=True,
    )
    selected = [chunk for score, chunk in ranked if score > 0][:limit]
    if not selected:
        return ""
    return "\n\n".join(selected)


def retrieve_chroma_context(question: str, limit: int = 4) -> str:
    collection = get_chroma_collection()
    if collection is None:
        return ""

    try:
        results = collection.query(query_embeddings=[embed_text(question)], n_results=limit)
        documents = results.get("documents", [[]])[0]
        return "\n\n".join(documents)
    except Exception:
        return ""


def ask_ollama(question: str, context: str) -> str:
    prompt = f"""You are the official assistant for the HOLLOWFALL website.

Rules:
- Answer only using the context below.
- Do not invent details.
- If the answer is not in the context, say: "I couldn't find that information in the Hollow Fall knowledge base."
- Keep the answer short and helpful.

Context:
{context}

Question:
{question}
"""
    response = requests.post(
        OLLAMA_URL,
        json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
        timeout=45,
    )
    response.raise_for_status()
    return response.json().get("response", "").strip()


def fallback_answer(context: str) -> str:
    if not context:
        return "I couldn't find that information in the Hollow Fall knowledge base."
    first_block = context.split("\n\n", 1)[0]
    return first_block


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "local_chunks": len(CHUNKS),
        "chroma_enabled": get_chroma_collection() is not None,
    }


@app.get("/")
def home() -> dict:
    return {
        "message": "Hollow Fall backend is running successfully.",
        "docs": "/docs",
        "health": "/health",
    }


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    question = payload.message.strip()
    if not question:
        return ChatResponse(answer="Ask me something about Hollow Fall.", source="local")

    context = retrieve_context(question)
    if not context:
        return ChatResponse(
            answer="I couldn't find that information in the Hollow Fall knowledge base.",
            source="local",
        )

    try:
        answer = ask_ollama(question, context)
        return ChatResponse(answer=answer or fallback_answer(context), source="ollama")
    except requests.RequestException:
        return ChatResponse(answer=fallback_answer(context), source="local")
