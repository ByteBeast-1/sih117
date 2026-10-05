# Contracts — Agents/AI's Two Boundaries

## Part A — What This Phase Returns to Full-Stack

Identical to `phases/01-fullstack/CONTRACTS.md` Sections 1–6. This phase implements the **server
side** of those exact shapes on an internal service (e.g. `http://agents-service:9000`). Not
repeated here to avoid the two files drifting apart — that file is the source of truth for these
shapes. If a shape needs to change, edit it there first, in a PR, tagging both phase owners.

## Part B — What This Phase Expects From DevOps/Infra's Sandbox Service

`POST http://sandbox-service:9100/internal/execute`

```json
// REQUEST (this phase sends)
{ "code": "import openpyxl\n...", "timeout_seconds": 30 }

// RESPONSE — success
{ "success": true, "stdout": "...", "stderr": "", "exit_code": 0 }

// RESPONSE — failure
{ "success": false, "stdout": "", "stderr": "NameError: ...", "exit_code": 1 }
```

Full detail (security flags, timeout behavior) is owned by `phases/03-devops-infra/CONTRACTS.md`
— this is just the calling shape this phase codes against.

## Part C — Internal Contracts Between Agents (inside this phase, same person, but written down
because multiple sub-phases depend on them)

### Supervisor → Generation Agent

```python
def request_generation(kind: str, content: dict, task_id: str) -> dict:
    """
    kind: "docx" | "xlsx" | "pptx"
    Returns: { "status": "queued" }  -- actual result fetched later via
    GET /internal/agents/generation/status/{task_id}, matching
    phases/01-fullstack/CONTRACTS.md Section 4.
    """
```

### Any Agent → Knowledge/RAG Search (internal function, not HTTP — same process)

```python
def rag_search(query: str, top_k: int = 5) -> list[dict]:
    """
    Returns: [{ "document": str, "page": int, "snippet": str, "subtopic": str, "confidence": float }]
    Used by: Knowledge agent directly, Math agent (when a calculation references an SOP value),
    Blueprint agent (when cross-referencing extracted values against documented limits).
    If no result clears a minimum confidence threshold, return an empty list - callers must then
    set "grounded": false in their response rather than falling back to the model's own knowledge.
    """
```

### Supervisor → Sandbox (via DevOps, see Part B) — Retry Contract

The Supervisor's LangGraph retry loop caps at **3 attempts** on sandbox failure before returning
a `"status": "failed"` response rather than looping indefinitely. This number is deliberate — do
not remove the cap "to let it keep trying," per `NON_NEGOTIABLES.md` rule (b) on clean, predictable
behavior.
