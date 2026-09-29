# 🏭 Sovereign On-Premise Agentic AI Workbench

> **SIH 2026 — Problem Statement 26117 · Theme: Smart Automation**
> Organization: Mangalore Refinery and Petrochemicals Limited (MRPL)

A **self-hosted, air-gapped AI workbench** running entirely on the organization's own GPU server. Nothing leaves the premises. Multiple AI agents work together — auto-routed by task type — to handle knowledge retrieval, engineering calculations, code execution, document generation, and blueprint analysis. All grounded in the organization's own documents via a local RAG pipeline.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [File Structure](#-file-structure)
- [Setup & Installation](#-setup--installation)
- [Running the Application](#-running-the-application)
- [Features Walkthrough](#-features-walkthrough)
- [Non-Negotiables](#-non-negotiables)
- [Future Roadmap](#-future-roadmap)

---

## 🎯 Problem Statement

**Background:** Refineries, PSUs, defence-linked manufacturing units and government offices generate massive amounts of sensitive knowledge work — approval notes, engineering calculations, code for internal tools, review of scanned drawings. None of this can go through cloud AI assistants because the data is confidential. Company policy keeps data on premises, so people either do work manually or risk pasting confidential material into public tools.

**Challenge:** Build a working local deployment demonstrating:
- ✅ Model auto-selection across ≥2 task types
- ✅ End-to-end agentic task (scanned report → findings → drafted Word doc)
- ✅ Coding task executed and verified in a sandbox
- ✅ Multimodal task involving image/document understanding
- ✅ Visible proof of zero external API calls (network monitor)

---

## 💡 Our Solution

A **local web application** with role-based access — Admin Dashboard and Client Workbench — powered by **6 specialized AI agents** all running on local hardware:

| Agent | What it does |
|-------|-------------|
| **🧠 Supervisor** | Auto-routes user requests to the right agent; main entry point |
| **📚 Knowledge (RAG)** | Retrieves answers from local documents with citations |
| **🔢 Math/Calculation** | Step-by-step engineering calculations with safety checks |
| **💻 Code Sandbox** | Writes, executes, and debugs code in an isolated sandbox |
| **📄 Generation** | Creates Word/Excel/PPT documents from templates |
| **🔍 Vision/Blueprint** | Analyzes P&IDs, schematics, and engineering drawings |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│          CLIENT (Browser — any device on the local network)      │
│    Login → Role Check → Admin Dashboard OR Client Workbench      │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTP over Local LAN
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│               FRONTEND (React + Vite + Tailwind CSS)             │
│  Login · Sidebar · Chat Panel · Code Editor · Admin Dashboard    │
│                         Port 5173                                │
└──────────────────────────────┬──────────────────────────────────┘
                               │  REST API (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI + Python)                      │
│  JWT Auth · Supervisor Router · Agent Endpoints · Admin APIs     │
│  Knowledge Base (ChromaDB) · Math Engine · Code Sandbox          │
│                         Port 8000                                │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTP (localhost only)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│               MODEL SERVER (Ollama — Local LLMs)                 │
│  qwen2.5:1.5b (reasoning) · qwen2.5-coder:1.5b (coding)        │
│  Extensible: add new models via `ollama pull`                    │
│                         Port 11434                               │
└─────────────────────────────────────────────────────────────────┘

                    ⛔ ZERO EXTERNAL API CALLS ⛔
              All computation stays on the local machine
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 6, Tailwind CSS 3 | Modern SPA with dark-themed UI |
| **Backend** | FastAPI, Python 3.10+ | REST API, auth, agent orchestration |
| **Database** | SQLite (async) | User auth, audit trail |
| **Vector Store** | ChromaDB | RAG embeddings & document retrieval |
| **LLM Server** | Ollama | Local model inference |
| **Models** | Qwen 2.5 1.5B, Qwen 2.5 Coder 1.5B | Reasoning & code generation |
| **Auth** | JWT + bcrypt | Role-based access (admin/user) |

---

## 📁 File Structure

```
SIH26-Sovereign-Workbench/
├── README.md                          ← This file
├── .gitignore
│
├── frontend/                          ← React + Vite application
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   ├── .env                           ← API base URL config
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx                   ← App entry point
│       ├── App.jsx                    ← Route definitions
│       ├── index.css                  ← Global styles
│       ├── services/
│       │   └── api.js                 ← Unified API client
│       ├── pages/
│       │   ├── Login.jsx              ← Authentication screen
│       │   ├── ClientWorkbench.jsx    ← Main agent chat interface
│       │   ├── AnalyzerAgent.jsx      ← Document analysis page
│       │   ├── GenerationAgent.jsx    ← Document generation page
│       │   ├── CodeSandbox.jsx        ← Code editor + execution
│       │   ├── AdminDashboard.jsx     ← System monitoring
│       │   └── ...
│       ├── components/
│       │   ├── chat/                  ← Chat UI components
│       │   ├── admin/                 ← Admin dashboard widgets
│       │   ├── workspace/             ← Code editor, sandbox
│       │   └── layout/                ← Sidebar, topbar, status
│       └── mocks/
│           └── agents.js             ← Mock data for offline dev
│
├── backend/                           ← FastAPI application
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    ← FastAPI app + lifespan
│   │   ├── auth.py                    ← JWT auth + bcrypt
│   │   ├── database.py                ← SQLAlchemy async engine
│   │   ├── models.py                  ← User ORM model
│   │   ├── schemas.py                 ← Pydantic request models
│   │   ├── ollama_client.py           ← Ollama LLM wrapper
│   │   ├── knowledge_base.py          ← RAG engine (ChromaDB)
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py                ← Login + JWT endpoints
│   │       ├── agents.py              ← All agent endpoints
│   │       └── admin.py               ← Admin APIs
│   └── knowledge_base/               ← Sample MRPL documents
│
└── docs/                              ← Documentation & diagrams
    ├── ARCHITECTURE.md
    ├── API_CONTRACTS.md
    └── SETUP_GUIDE.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Python 3.10+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Ollama** — [ollama.com](https://ollama.com) (for local LLM inference)
- **Git** — [git-scm.com](https://git-scm.com)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/SIH26-Sovereign-Workbench.git
cd SIH26-Sovereign-Workbench
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Ollama Setup (Optional — backend works with graceful fallback)

```bash
# Install Ollama from https://ollama.com
# Pull the required models:
ollama pull qwen2.5:1.5b
ollama pull qwen2.5-coder:1.5b
```

---

## ▶️ Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
.\venv\Scripts\activate          # Windows
# source venv/bin/activate       # Linux/Mac
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

### Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **API Docs (Swagger)** | http://localhost:8000/docs |

### Login Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |
| `eng_rajesh` | `engineer123` | Engineer |

---

## ✨ Features Walkthrough

### 1. 🔐 Role-Based Login
- JWT-based authentication with bcrypt password hashing
- Admin users see the Admin Dashboard; Engineers see the Client Workbench
- Session persists across page reloads

### 2. 🧠 Supervisor Agent (Auto-Routing)
- Natural language intent detection routes queries to the correct agent
- Visible "thinking trace" shows the reasoning pipeline
- Every response includes citations to source documents

### 3. 📚 Knowledge Agent (RAG)
- ChromaDB-powered vector search over local documents
- Pre-loaded with 5 MRPL sample documents (SOPs, manuals, formulas)
- Answers grounded ONLY in organization documents — never general knowledge

### 4. 🔢 Math Agent
- Step-by-step engineering calculations (hoop stress, heat transfer, etc.)
- Cross-references results against SOP safety limits
- Shows formula, substitution, and verification

### 5. 💻 Code Sandbox
- Monaco editor with syntax highlighting
- Secure execution with network blocking and timeout enforcement
- Captures stdout, stderr, and exit code

### 6. 📄 Document Generation
- Generates approval notes, reports from templates
- Sources data from the knowledge base
- Outputs in standard MRPL document format

### 7. 🔍 Vision/Blueprint Agent
- P&ID and schematic analysis
- Equipment tag extraction and cross-referencing
- Yield prediction based on configuration

### 8. 🛡️ Admin Dashboard
- Real-time server health monitoring (CPU, memory, disk)
- Model registry with Ollama integration
- **Network monitor** — live proof of zero outbound traffic
- Immutable audit trail with hash chain

---

## ⛔ Non-Negotiables

1. **100% Offline** — Zero external API calls. Ever. The network monitor proves it.
2. **Grounded in Documents** — Every answer cites the exact source. No hallucinated facts.
3. **Extensible** — New models added via `ollama pull`. New agents are a router + endpoint.
4. **Clean Code** — Every file is documented, every function has docstrings.

---

## 🔮 Future Roadmap

| Prototype (Now) | Production (Later) |
|------------------|-------------------|
| 2 × 1.5B models on laptop GPU | Full model roster on GPU server |
| Sample SOP documents | Real MRPL manuals & SOPs |
| JWT + RBAC auth | Enterprise SSO + VLAN isolation |
| Basic audit log | Compliance-grade immutable ledger |
| Template-based vision | Full Qwen2-VL for P&ID understanding |

---

## 👥 Team

Built for Smart India Hackathon 2026 — Problem Statement 26117
Organization: MRPL (Mangalore Refinery and Petrochemicals Limited)

---

*This project is 100% sovereign — no data leaves the machine. Ever.* 🇮🇳
