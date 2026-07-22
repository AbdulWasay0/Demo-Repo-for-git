import os
import re
import hashlib
from pathlib import Path

import chromadb
from dotenv import load_dotenv


APP_DIR = Path(__file__).resolve().parent
load_dotenv(APP_DIR / ".env")
KNOWLEDGE_PATH = APP_DIR / "knowledge_base" / "hollowfall.txt"
COLLECTION_NAME = os.getenv("CHROMA_COLLECTION", "hollowfall_knowledge")
EMBEDDING_SIZE = 384


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


def get_chroma_client():
    api_key = os.getenv("CHROMA_API_KEY")
    tenant = os.getenv("CHROMA_TENANT")
    database = os.getenv("CHROMA_DATABASE")

    if not api_key or not tenant or not database:
        raise RuntimeError("Set CHROMA_API_KEY, CHROMA_TENANT, and CHROMA_DATABASE first.")

    return chromadb.CloudClient(
        api_key=api_key,
        tenant=tenant,
        database=database,
    )


def main():
    text = KNOWLEDGE_PATH.read_text(encoding="utf-8")
    chunks = [chunk.strip() for chunk in text.split("\n\n") if chunk.strip()]

    client = get_chroma_client()
    collection = client.get_or_create_collection(COLLECTION_NAME)

    ids = [f"hollowfall-{index}" for index in range(len(chunks))]
    embeddings = [embed_text(chunk) for chunk in chunks]
    collection.upsert(ids=ids, documents=chunks, embeddings=embeddings)

    print(f"Uploaded {len(chunks)} chunks to Chroma collection: {COLLECTION_NAME}")


if __name__ == "__main__":
    main()
