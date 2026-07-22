# Hollow Fall Local Chatbot

This backend uses your website data from `knowledge_base/hollowfall.txt`.

## Run

Install dependencies:

```bash
pip install -r requirements.txt
```

Optional, for AI answers:

```bash
ollama pull llama3.1
ollama serve
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

If Ollama is not running, the chatbot still gives local knowledge-base answers.
