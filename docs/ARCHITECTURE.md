# System Architecture — Deep Dive

## Overview

The Sovereign On-Premise Agentic AI Workbench is a three-tier application designed for complete air-gap operation. No component makes external API calls — all inference, search, and computation runs on the local machine.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    React SPA (Vite)                          │    │
│  │  ┌──────┐  ┌───────────┐  ┌──────────┐  ┌───────────────┐  │    │
│  │  │Login │  │ Workbench │  │  Admin   │  │  Code Editor  │  │    │
│  │  │ Page │  │   Chat    │  │Dashboard │  │   (Monaco)    │  │    │
│  │  └──────┘  └───────────┘  └──────────┘  └───────────────┘  │    │
│  └────────────────────────┬────────────────────────────────────┘    │
└───────────────────────────┼────────────────────────────────────────┘
                            │ REST API (JSON over HTTP)
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend (:8000)                          │
│                                                                     │
│  ┌──── Auth Layer ────┐  ┌──── Agent Router ─────────────────────┐ │
│  │  JWT + bcrypt      │  │                                       │ │
│  │  Role: admin/user  │  │  ┌─────────────────────┐             │ │
│  └────────────────────┘  │  │  Supervisor Agent    │             │ │
│                          │  │  (Intent Detection)  │             │ │
│  ┌──── Knowledge ─────┐ │  └──────────┬──────────┘             │ │
│  │  ChromaDB           │ │             │                         │ │
│  │  (Vector Embeddings)│ │  ┌──────────┼──────────────────────┐ │ │
│  │  all-MiniLM-L6-v2   │ │  │          ▼                      │ │ │
│  │                     │ │  │  ┌───────────┬──────────┐       │ │ │
│  │  5 MRPL Documents:  │ │  │  │Knowledge  │  Math    │       │ │ │
│  │  - Pressure SOP     │ │  │  │  (RAG)    │  Agent   │       │ │ │
│  │  - CDU Manual       │ │  │  ├───────────┼──────────┤       │ │ │
│  │  - Formulas         │ │  │  │ Code      │ Vision   │       │ │ │
│  │  - Material Stds    │ │  │  │ Sandbox   │ Agent    │       │ │ │
│  │  - Inspection Report│ │  │  ├───────────┴──────────┤       │ │ │
│  └─────────────────────┘ │  │  │   Generation Agent   │       │ │ │
│                          │  │  └──────────────────────┘       │ │ │
│  ┌──── Admin APIs ────┐ │  └──────────────────────────────────┘ │ │
│  │  Health Monitor     │ │                                       │ │
│  │  Model Registry     │ └───────────────────────────────────────┘ │
│  │  Network Monitor    │                                           │
│  │  Audit Trail        │                                           │
│  └─────────────────────┘                                           │
└───────────────────────────┬────────────────────────────────────────┘
                            │ HTTP (localhost:11434)
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Ollama Model Server                            │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────────┐                    │
│  │ qwen2.5:1.5b     │  │ qwen2.5-coder:1.5b   │                   │
│  │ (Reasoning)      │  │ (Code Generation)     │                   │
│  └──────────────────┘  └──────────────────────┘                    │
│                                                                     │
│  Extensible: `ollama pull <model>` to add more                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Query → Agent Response

```
1. User types message in Client Workbench
2. Frontend sends POST /api/v1/agents/supervisor/message
3. Supervisor detects intent via keyword classification
4. Routes to appropriate agent:
   ├── Knowledge → ChromaDB search → LLM generation with context
   ├── Math      → Formula engine + LLM verification
   ├── Coding    → LLM code generation → sandbox execution
   ├── Vision    → Document analysis + equipment extraction
   └── Generation→ Template + LLM content → document output
5. Response includes: reply, thinking_trace, citations, grounded flag
6. Frontend renders with thinking animation + citation cards
```

### Authentication Flow

```
1. User enters credentials on Login page
2. POST /api/v1/auth/login → bcrypt verification → JWT issued
3. JWT stored in localStorage, attached to all subsequent requests
4. Role extracted from JWT determines dashboard routing
5. Protected routes verify JWT on every request
```

## Security Model

- **No external API calls** — Ollama runs on localhost:11434
- **Code sandbox** — blocks network-related imports, enforces timeouts
- **JWT authentication** — all agent endpoints require valid token
- **Network monitor** — real-time proof of zero outbound traffic via `psutil`
- **Audit trail** — hash-chained log of every agent interaction
