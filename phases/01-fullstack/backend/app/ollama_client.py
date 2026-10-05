"""
Ollama client wrapper — provides a unified interface for calling local LLMs.
Handles connection management, fallback responses, and model health checks.
All inference stays on-premise; zero external API calls.
"""

import httpx
import json
import logging
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "qwen2.5:3b"
CODER_MODEL = "qwen2.5:3b"

# Timeout settings (seconds)
CONNECT_TIMEOUT = 5.0
READ_TIMEOUT = 120.0  # LLM generation can be slow


async def check_ollama_health() -> Dict[str, Any]:
    """Check if Ollama server is running and list available models."""
    try:
        async with httpx.AsyncClient(timeout=CONNECT_TIMEOUT) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                data = resp.json()
                models = [m["name"] for m in data.get("models", [])]
                return {"status": "healthy", "models": models}
    except Exception as e:
        logger.warning(f"Ollama health check failed: {e}")
    return {"status": "unavailable", "models": []}


async def generate(
    prompt: str,
    model: str = DEFAULT_MODEL,
    system: Optional[str] = None,
    temperature: float = 0.1,
    max_tokens: int = 2048,
) -> Dict[str, Any]:
    """
    Send a prompt to an Ollama model and return the generated response.
    Returns a dict with 'response' (str) and 'model' (str).
    Falls back to an error dict if Ollama is unavailable.
    """
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    try:
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(CONNECT_TIMEOUT, read=READ_TIMEOUT)
        ) as client:
            resp = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": model,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens,
                    },
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "response": data.get("message", {}).get("content", ""),
                    "model": model,
                    "eval_duration_ms": data.get("eval_duration", 0) / 1e6,
                    "ollama_available": True,
                }
    except httpx.ConnectError:
        logger.warning("Ollama not reachable — using fallback response")
    except httpx.ReadTimeout:
        logger.warning("Ollama read timeout — model may be loading")
    except Exception as e:
        logger.error(f"Ollama call failed: {e}")

    return {
        "response": "",
        "model": model,
        "eval_duration_ms": 0,
        "ollama_available": False,
    }


async def generate_with_context(
    query: str,
    context_chunks: List[str],
    model: str = DEFAULT_MODEL,
    system_prompt: Optional[str] = None,
) -> Dict[str, Any]:
    """
    RAG-style generation: provide context chunks alongside the user query.
    The model grounds its answer in the provided context only.
    """
    context_text = "\n\n---\n\n".join(context_chunks)

    default_system = (
        "You are an AI assistant for MRPL (Mangalore Refinery and Petrochemicals Limited). "
        "Answer ONLY based on the provided context documents. "
        "If the answer is not in the context, say 'I could not find this information in the available documents.' "
        "Always cite which document and section your answer comes from. "
        "Be precise and technical."
    )

    prompt = f"""Based on the following documents from the organization's knowledge base:

{context_text}

---

User Question: {query}

Provide a detailed, grounded answer with citations to the specific documents above."""

    return await generate(
        prompt=prompt,
        model=model,
        system=system_prompt or default_system,
        temperature=0.1,
    )
