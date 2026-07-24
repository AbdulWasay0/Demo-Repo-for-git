import json
import os
import urllib.request
import urllib.error

OLLAMA_URL = os.getenv("OLLAMA_HOST", "http://localhost:11434")
MODEL_NAME = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")


def chat_with_ollama(prompt):
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
    }

    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"{OLLAMA_URL}/api/generate",
        data=data,
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            result = json.load(response)
            return result.get("response", "").strip()
    except urllib.error.URLError as e:
        return f"Ollama error: {e}"
    except Exception as e:
        return f"Unexpected error: {e}"


if __name__ == "__main__":
    while True:
        user_input = input("You: ")

        if user_input.lower() in ["quit", "exit", "bye"]:
            break

        answer = chat_with_ollama(user_input)
        print("\nChatbot:", answer)
