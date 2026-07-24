# Render Backend

The backend app lives in `backend/`.

Required Render settings:

- Language: `Python 3`
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Optional environment variables:

- `CHROMA_API_KEY`
- `CHROMA_TENANT`
- `CHROMA_DATABASE`
- `CHROMA_COLLECTION`
- `OLLAMA_URL`
- `OLLAMA_MODEL`
- `FRONTEND_ORIGINS`
