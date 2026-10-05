# Sub-Phase 2 — Sandbox Execution Service

## Goal

Build the isolated code-execution engine described in `../CONTRACTS.md` Section 1 — this is the
"sandbox" security mechanism (distinct from the Coding Workspace *page*, which is Full-Stack's job
— see main `README.md` Section 6 for the full explanation of that distinction).

## Tech Stack

FastAPI + the `docker` Python SDK.

## Expected Files After This Sub-Phase

```
phases/03-devops-infra/
  sandbox_service/
    app/
      main.py
      executor.py        # the actual container-launching logic
    requirements.txt
```

## Setup Steps

1. `pip install fastapi uvicorn docker`
2. Build `executor.py`: write incoming code to a temp file, launch a **new** `python:3.11-slim`
   container via `docker.from_env().containers.run(...)` with ALL FOUR security flags together:
   `network_mode="none"`, `mem_limit="512m"`, `nano_cpus=500_000_000`, `read_only=True`,
   `cap_drop=["ALL"]`, plus `remove=True` so it's disposable.
3. Enforce `timeout_seconds` — either via the SDK's timeout handling or a watchdog thread that
   kills the container on expiry.
4. Mount a temp dir to `/workspace` inside the container so scripts can write output files there.

## Test It Thoroughly (this is the part that actually matters)

```bash
uvicorn app.main:app --reload --port 9100

# Normal case
curl -X POST localhost:9100/internal/execute -d '{"code":"print(1+1)","timeout_seconds":10}'

# Network isolation - THIS MUST FAIL
curl -X POST localhost:9100/internal/execute -d '{"code":"import socket; socket.create_connection((\"8.8.8.8\",53))","timeout_seconds":10}'

# Timeout - THIS MUST BE KILLED, not hang
curl -X POST localhost:9100/internal/execute -d '{"code":"while True: pass","timeout_seconds":5}'
```

## What "Done" Looks Like

- All three test cases above behave correctly.
- `docker ps -a` after running several requests shows **no lingering containers** — every one was
  genuinely disposable.
- Response shapes match `../CONTRACTS.md` Section 1 exactly, including the failure case.

## Hands Off To

Sub-phase 3 wires this service into the full Compose stack alongside everyone else's containers.
