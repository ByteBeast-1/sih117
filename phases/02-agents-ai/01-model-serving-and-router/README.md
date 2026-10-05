# Sub-Phase 1 — Model Serving & Router

## Goal

Get Ollama serving local models, build the model registry (a list, not hardcoded logic — this is
the extension point from `README.md`), and the router function that maps a task type to a model.

## Tech Stack

Ollama + FastAPI + a simple in-memory or file-backed registry (JSON file is fine for prototype).

## Expected Files After This Sub-Phase

```
phases/02-agents-ai/
  app/
    main.py
    registry.py        # load/save the model list, add_model(), route_task()
    ollama_client.py    # thin wrapper around ollama chat/generate calls
    routers/
      registry.py       # GET/POST /internal/agents/registry/models (see CONTRACTS.md Part A)
  registry.json          # [{ "name": "qwen2.5:1.5b", "role": "reasoning", "status": "loaded" }, ...]
  requirements.txt
```

## Setup Steps

1. `ollama pull qwen2.5:1.5b` and `ollama pull qwen2.5-coder:1.5b` (tiny models, fine for prototype dev)
2. `python3 -m venv venv && source venv/bin/activate`
3. `pip install fastapi uvicorn ollama pydantic`
4. Build `registry.py` so `route_task("reasoning")` returns `"qwen2.5:1.5b"`, reading from `registry.json`
5. `POST /internal/agents/registry/models` appends a new entry to `registry.json` — no restart required
   to pick it up on the *next* request (read the file fresh, or watch it — don't cache forever).

## What "Done" Looks Like

- `GET /internal/agents/registry/models` returns the current list.
- `POST /internal/agents/registry/models` with a new model name+role actually shows up in the next
  `GET` call, without redeploying anything.
- A simple test script that calls `route_task("coding")` and gets back the coder model's name,
  then actually calls Ollama with it and gets a real response.

## Hands Off To

Every other sub-phase in this phase calls `route_task()` from here to know which model to use.
