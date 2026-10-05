# Sub-Phase 3 — Supervisor Agent

## Goal

Build the "general" agent behind the Coding Workspace page: a LangGraph agent that can chat, edit
code, propose file edits (always flagged as requiring confirmation), call the sandbox to run code
with a capped retry loop, and route requests that actually belong to another agent (generation,
knowledge, math) to that agent instead of trying to handle them itself.

## Tech Stack

LangGraph + the router/model client from sub-phase 1 + an HTTP client (httpx) to call DevOps/
Infra's sandbox service.

## Expected Files After This Sub-Phase

```
phases/02-agents-ai/app/
  agents/
    supervisor_graph.py     # the LangGraph graph itself
    sandbox_client.py       # calls DevOps/Infra per ../CONTRACTS.md Part B
  routers/
    supervisor.py           # POST /internal/agents/supervisor/message
                             # WS /ws/supervisor/{session_id}
```

## Graph Design

Nodes: `classify_intent` (is this a coding task, or should it route elsewhere?) →
`plan_and_edit` (produce code/file edit proposals) → `run_sandbox` (call DevOps/Infra) →
conditional edge: on failure, → `fix` (feed stderr back to the model) → loop to `run_sandbox`,
capped at **3 attempts** total (per `../CONTRACTS.md` Part C) → `finalize`.

If `classify_intent` decides the request is really a generation/knowledge/math request, skip
straight to a `route_elsewhere` node that calls the relevant sub-phase's function and returns its
result with `"routed_to_agent"` set accordingly.

## Setup Steps

1. `pip install langgraph`
2. Build the graph per the design above, using `route_task("coding")` from sub-phase 1 for the model.
3. Use `USE_SANDBOX_MOCK=true` in `.env` to return canned sandbox results until DevOps/Infra
   has something real running — canned shape is in `../CONTRACTS.md` Part B.
4. Wire the WebSocket endpoint to push a message after each node the graph visits.

## What "Done" Looks Like

- A coding request produces a real plan, a proposed edit (with `requires_confirmation: true`),
  and a sandbox result (mocked) — matching `phases/01-fullstack/CONTRACTS.md` Section 3 exactly.
- Deliberately feeding it a request that produces broken code shows the retry loop actually
  capping at 3 attempts, then returning a failed status gracefully.
- A request like "generate a PPT of this" returns a response with `"routed_to_agent": "generation"`
  rather than the Supervisor trying to write a PPTX itself.

## Hands Off To

Sub-phase 4 (Generation) is what `route_elsewhere` actually calls once it exists for real.
