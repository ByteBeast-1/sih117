# 🏭 Sovereign On-Premise Agentic AI Workbench

[![SIH 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://sih.gov.in/)
[![Theme: Smart Automation](https://img.shields.io/badge/Theme-Smart%20Automation-blue.svg)]()
[![Organization: MRPL](https://img.shields.io/badge/Organization-MRPL-green.svg)](https://www.mrpl.co.in/)
[![Air-Gap Certified](https://img.shields.io/badge/Security-100%25%20Air--Gapped-emerald.svg)]()
[![Zero External API Calls](https://img.shields.io/badge/Network-Zero%20External%20Calls-red.svg)]()
[![Repository: sih117](https://img.shields.io/badge/GitHub-ByteBeast--1%2Fsih117-purple.svg)](https://github.com/ByteBeast-1/sih117)

> **Smart India Hackathon (SIH 2026) · Problem Statement: 26117**  
> **Organization:** Mangalore Refinery and Petrochemicals Limited (MRPL)  
> **Primary Repository:** [https://github.com/ByteBeast-1/sih117](https://github.com/ByteBeast-1/sih117)  
> **Reference Architecture:** [https://github.com/SakthiCharukeshS/SIH26-Workbench](https://github.com/SakthiCharukeshS/SIH26-Workbench)

---

## 📌 Executive Summary

The **MRPL Sovereign Engineering Workbench** is a fully self-hosted, air-gapped industrial AI platform engineered for sensitive energy, refinery, and defense operations. Operating 100% on local hardware, it guarantees that no proprietary blueprints, P&IDs, equipment specifications, maintenance logs, or employee records ever leave the corporate network.

The platform orchestrates a **LangGraph multi-agent fabric** powered by local Large Language Models (Qwen 2.5 via Ollama), local vector retrieval (ChromaDB), real-time document generators (PDF, PPTX, Excel, LaTeX), and an isolated, air-gapped Docker execution container (`--network none`) pre-baked with scientific libraries (`numpy`, `scipy`, `pandas`, `matplotlib`, `sympy`).

---

## 📑 Table of Contents

1. [Problem Statement & Background](#-problem-statement--background)
2. [Sovereign Architecture](#-sovereign-architecture)
3. [Project Directory & File Structure](#-project-directory--file-structure)
4. [Multi-Phase Project Organization](#-multi-phase-project-organization)
5. [Agent Capabilities & Workflows](#-agent-capabilities--workflows)
6. [Docker Bundles & Air-Gap Deployment](#-docker-bundles--air-gap-deployment)
7. [Quick Start & Local Setup](#-quick-start--local-setup)
8. [Air-Gap Verification for Evaluators](#-air-gap-verification-for-evaluators)
9. [Sovereign Engineering Principles](#-sovereign-engineering-principles)
10. [Primary Repositories & Team](#-primary-repositories--team)

---

## 🎯 Problem Statement & Background

### Context
Industrial facilities, refineries, and PSUs manage massive amounts of confidential knowledge work:
- Standard Operating Procedures (SOPs) and safety compliance checks
- Distillation column pressure drop ($\Delta P$) and thermodynamic calculations
- Automated inspection of engineering blueprints and P&ID drawings
- Code execution for operational automation scripts
- Generation of formal sign-off dossiers, executive reports, and presentations

### The Conflict
Using commercial cloud AI (OpenAI, Anthropic, Gemini) violates corporate data isolation policies and creates severe data leakage risks. Conversely, manual processing causes bottlenecks.

### The Solution
A 100% on-premise, turnkey software appliance running on local workstation or GPU server hardware (e.g., NVIDIA RTX 3050 / RTX 4090 / A100) delivering cloud-grade intelligence with **zero outbound internet traffic**.

---

## 🏗️ Sovereign Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER ACCESS LAYER                               │
│  Browser / Client on Intranet: http://localhost:3000                   │
│  Clean, Minimalist Portal (GitHub/Obsidian Dark Theme)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP (Local LAN Only)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 FRONTEND WORKBENCH (React 19 + Vite + Tailwind)        │
│  • General Chat (Supervisor)      • Analyser Agent (Structural Audit)  │
│  • Generator AI (Live Preview)    • Code Sandbox (Docker Terminal)     │
│  • Artifacts Library (SQLite DB)  • Admin Diagnostics Console          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            FASTAPI ORCHESTRATION GATEWAY (Port 8000)                   │
│  • JWT Authentication & Session Persistence (SQLite Async)             │
│  • LangGraph StateGraph Supervisor & Multi-Agent Router                │
│  • Grounded RAG Search (ChromaDB Vector Store)                         │
│  • Real File Generators: FPDF2, python-pptx, openpyxl, LaTeX           │
└─────────────┬──────────────────────────┬───────────────────────────────┘
              │                          │
              ▼ (Docker Socket)          ▼ (HTTP localhost:11434)
┌───────────────────────────────┐ ┌──────────────────────────────────────┐
│  AIR-GAPPED DOCKER SANDBOX    │ │  LOCAL LLM SERVER (Ollama)           │
│  Image: python:3.10-slim      │ │  Models:                             │
│  Flag:  --network none        │ │  • qwen2.5:3b (Reasoning & RAG)      │
│  Pre-installed Suite:         │ │  • qwen2.5-coder:1.5b (Python/Code)  │
│  numpy, scipy, pandas,        │ │  Hardware: NVIDIA CUDA 12.7 GPU Accel│
│  matplotlib, sympy            │ │                                      │
└───────────────────────────────┘ └──────────────────────────────────────┘
                  ⛔ ZERO EXTERNAL NETWORK CALLS ⛔
```

---

## 📂 Project Directory & File Structure

The codebase is organized as a production-grade, modular monorepo cleanly separating frontend, backend, orchestration, and phase milestone artifacts:

```text
SIH26-Sovereign-Workbench/
├── backend/                                # FastAPI On-Premise Application & Local AI Core
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py                         # JWT token generation, password hashing & verification
│   │   ├── database.py                     # SQLite asynchronous connection & metadata
│   │   ├── knowledge_base.py               # ChromaDB vector store, chunking & PyMuPDF extraction
│   │   ├── main.py                         # FastAPI application entrypoint & middleware
│   │   ├── models.py                       # SQLAlchemy database models (Users, Chats, Artifacts)
│   │   ├── ollama_client.py                # Local Ollama REST client with streaming & timeouts
│   │   ├── schemas.py                      # Pydantic validation schemas for API payloads
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── admin.py                    # Admin diagnostics, model registry & audit trails
│   │       ├── agents.py                   # Multi-agent orchestrator, RAG, sandbox & generators
│   │       └── auth.py                     # Login & user verification routes
│   ├── Dockerfile                          # Multi-stage Python 3.11 backend container
│   └── requirements.txt                    # FastAPI, LangGraph, ChromaDB, PyMuPDF, ReportLab
│
├── frontend/                               # React 19 + Vite Enterprise UI
│   ├── public/
│   │   ├── docs/                           # Sample industrial engineering documents
│   │   ├── favicon.svg                     # Sovereign monogram favicon
│   │   └── icons.svg                       # SVG iconography asset sheet
│   ├── src/
│   │   ├── assets/                         # Static UI graphics
│   │   ├── components/
│   │   │   ├── admin/                      # Admin diagnostics, models, audit logs & docs viewer
│   │   │   ├── chat/                       # Chat panel, agent routing badges & thinking traces
│   │   │   ├── layout/                     # Client sidebar, top bar & persistent status bar
│   │   │   └── workspace/                  # Document analyzer, report generator, sandbox terminal
│   │   ├── mocks/                          # Standalone fallback mocks for offline development
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx          # Admin overview & system health
│   │   │   ├── AnalyzerAgent.jsx           # Technical document audit & entity extraction
│   │   │   ├── ArtifactsPage.jsx           # Database of generated deliverables with downloads
│   │   │   ├── BlueprintAgent.jsx          # P&ID & engineering diagram inspection
│   │   │   ├── ClientWorkbench.jsx         # Primary dual-pane engineer chat & streaming trace
│   │   │   ├── CodeSandbox.jsx             # Docker container terminal with pre-installed science suite
│   │   │   ├── GenerationAgent.jsx         # Live document generator (PDF, PPTX, Excel, LaTeX)
│   │   │   ├── KnowledgeAgent.jsx          # Semantic search & ChromaDB document query
│   │   │   ├── Login.jsx                   # Minimalist GitHub/Obsidian authentication portal
│   │   │   └── MathAgent.jsx               # Thermodynamic & engineering calculation sandbox
│   │   ├── services/
│   │   │   └── api.js                      # Centralized API client & HTTP interceptors
│   │   ├── App.jsx                         # React routing & AuthContext provider
│   │   ├── index.css                       # Global Tailwind CSS and scrollbar styling
│   │   └── main.jsx                        # React root bootstrap
│   ├── Dockerfile                          # Multi-stage Node 20 build + Nginx Alpine serve
│   ├── nginx.conf                          # Nginx production reverse proxy & SPA router
│   ├── package.json                        # Node dependencies (Lucide, Tailwind, Recharts)
│   └── vite.config.js                      # Vite build configuration (Port 3000)
│
├── phases/                                 # SIH Architecture & Phase Milestone Deliverables
│   ├── 01-fullstack/                       # Phase 1: Client UI, RBAC, Admin Shell & Contracts
│   │   ├── 01-setup-shell-auth/            # Sub-phase specification
│   │   ├── 02-client-sidebar-agent-pages/  # Sub-phase specification
│   │   ├── 03-supervisor-coding-workspace/ # Sub-phase specification
│   │   ├── 04-admin-dashboard/             # Sub-phase specification
│   │   ├── 05-integration-and-polish/      # Sub-phase specification
│   │   └── CONTRACTS.md                    # Interface definitions & API contracts
│   ├── 02-agents-ai/                       # Phase 2: LangGraph Fabric, Vector Store & Local LLMs
│   │   ├── 01-model-serving-and-router/    # Sub-phase specification
│   │   ├── 02-rag-knowledge-base/          # Sub-phase specification
│   │   ├── 03-supervisor-agent/            # Sub-phase specification
│   │   ├── 04-generation-agent/            # Sub-phase specification
│   │   ├── 05-vision-blueprint-agent/      # Sub-phase specification
│   │   ├── 06-math-calculation-agent/      # Sub-phase specification
│   │   ├── CONTRACTS.md                    # Agent state machine contracts
│   │   └── SIH26_Phase2_Delivery_Report.docx # Comprehensive delivery documentation
│   └── 03-devops-infra/                    # Phase 3: Docker Sandboxing, Air-Gap Audit & CI/CD
│       ├── 01-local-dev-environment/       # Sub-phase specification
│       ├── 02-sandbox-execution-service/   # Sub-phase specification
│       ├── 03-docker-compose-and-deployment/# Sub-phase specification
│       ├── 04-network-proof-and-monitoring/# Sub-phase specification
│       ├── 05-cicd-coderabbit-github-actions/# Sub-phase specification
│       └── CONTRACTS.md                    # Infrastructure boundary contracts
│
├── docs/                                   # Supplemental Architecture & Deployment Guides
│   └── DEPLOYMENT_GUIDE.md                 # Complete manual & Docker guide
├── sample_documents/                       # Pre-loaded refinery SOPs, equipment specs & logs
├── docker-compose.yml                      # Single-command stack coordinator
├── sovereign_backend_bundle.tar            # Pre-exported offline backend image (3.30 GB)
├── sovereign_frontend_bundle.tar           # Pre-exported offline frontend image (25.3 MB)
├── sovereign_sandbox_airgap_bundle.tar     # Pre-exported offline sandbox image (167.5 MB)
└── README.md                               # Project documentation & evaluation guide
```

---

## 🗂️ Multi-Phase Project Organization

In accordance with the architectural specification of [SakthiCharukeshS/SIH26-Workbench](https://github.com/SakthiCharukeshS/SIH26-Workbench), this repository is organized into distinct, modular phases with contract definitions:

### [Phase 1: Full-Stack](file:///c:/Users/sande/OneDrive/Desktop/sih/SIH26-Sovereign-Workbench/phases/01-fullstack)
- **Frontend Client Shell:** High-speed React 19 SPA with Obsidian/GitHub minimalist dark styling.
- **Client Workbench:** Dual-pane view featuring live agent reasoning stream and conversation history.
- **Admin Dashboard:** System telemetry, model registry controls, client audit logging, and documentation viewer.
- **Backend API Gateway:** FastAPI service with JWT authentication, SQLite database persistence, and REST endpoints.
- [Read Phase 1 Contracts](file:///c:/Users/sande/OneDrive/Desktop/sih/SIH26-Sovereign-Workbench/phases/01-fullstack/CONTRACTS.md)

### [Phase 2: Agents & AI](file:///c:/Users/sande/OneDrive/Desktop/sih/SIH26-Sovereign-Workbench/phases/02-agents-ai)
- **Sub-Phase 1:** Model serving & dynamic model registry router (`01-model-serving-and-router`).
- **Sub-Phase 2:** ChromaDB RAG knowledge base with semantic citations (`02-rag-knowledge-base`).
- **Sub-Phase 3:** LangGraph StateGraph supervisor & task intent classification (`03-supervisor-agent`).
- **Sub-Phase 4:** Real document generation engine for PDF, PPTX, XLSX, LaTeX (`04-generation-agent`).
- **Sub-Phase 5:** Vision, blueprint, and P&ID schematic analysis (`05-vision-blueprint-agent`).
- **Sub-Phase 6:** Step-by-step engineering mathematics engine (`06-math-calculation-agent`).
- [Read Phase 2 Contracts](file:///c:/Users/sande/OneDrive/Desktop/sih/SIH26-Sovereign-Workbench/phases/02-agents-ai/CONTRACTS.md)

### [Phase 3: DevOps & Infrastructure](file:///c:/Users/sande/OneDrive/Desktop/sih/SIH26-Sovereign-Workbench/phases/03-devops-infra)
- **Sub-Phase 1:** Local environment configuration & prerequisites (`01-local-dev-environment`).
- **Sub-Phase 2:** Air-gapped code sandbox execution container (`02-sandbox-execution-service`).
- **Sub-Phase 3:** Turnkey Docker Compose configuration & offline tarball bundle (`03-docker-compose-and-deployment`).
- **Sub-Phase 4:** Network audit proofs & air-gap validation scripts (`04-network-proof-and-monitoring`).
- **Sub-Phase 5:** Code quality assurance and CI/CD pipelines (`05-cicd-coderabbit-github-actions`).
- [Read Phase 3 Contracts](file:///c:/Users/sande/OneDrive/Desktop/sih/SIH26-Sovereign-Workbench/phases/03-devops-infra/CONTRACTS.md)

---

## 🤖 Agent Capabilities & Workflows

| Agent | Technology | Industrial Function |
|---|---|---|
| **🧠 Supervisor Agent** | LangGraph StateGraph | Intent classification (`conversational`, `knowledge`, `math`, `analyzer`, `coding`, `generation`, `vision`), routing queries to specialized nodes. |
| **📑 Analyser Agent** | PyPDF2, Local LLM | Ingests multi-format technical documents (PDF, TXT, LOG, CSV, Resumes), parses sections, verifies entities, and provides 1-click handoff to Generator. |
| **📄 Generator AI** | FPDF2, python-pptx, openpyxl | Compiles formal downloadable **PDF**, **PPTX**, **Excel**, and **LaTeX** deliverables with real-time side-by-side preview, grounded in analyzed documents. |
| **💻 Code Sandbox** | Docker (`--network none`) | Executes untrusted Python automation scripts with pre-installed scientific libraries (`numpy`, `scipy`, `pandas`, `matplotlib`, `sympy`) and automated import guards. |
| **🔢 Math Agent** | SymPy, Python Math | Computes engineering equations (e.g. Barlow's hoop stress, Rachford-Rice flash equilibria, Reynolds number) with explicit step-by-step verification. |
| **📦 Artifacts Library** | SQLite Database | Tracks all compiled deliverables, file sizes, creation timestamps, and linked conversation sessions with quick preview and download. |

---

## 🐳 Docker Bundles & Air-Gap Deployment

The entire system is containerized and pre-packaged into offline `.tar` image bundles for physical deployment to target laptops or servers with **zero internet connectivity** (e.g. transfer via encrypted USB drive):

### Pre-Packaged Offline Image Bundles

| Bundle Archive | Contents & Engine | Size | Load Command |
|---|---|---|---|
| **`sovereign_backend_bundle.tar`** | `sih26-backend:latest` (FastAPI, LangGraph, ChromaDB, Document Compilers) | 3.30 GB | `docker load -i sovereign_backend_bundle.tar` |
| **`sovereign_frontend_bundle.tar`** | `sih26-sovereign-workbench-frontend:latest` (Nginx Alpine + Vite Production Dist) | 25.3 MB | `docker load -i sovereign_frontend_bundle.tar` |
| **`sovereign_sandbox_airgap_bundle.tar`** | `python:3.10-slim` (Pre-baked `numpy`, `scipy`, `pandas`, `matplotlib`, `sympy`) | 167.5 MB | `docker load -i sovereign_sandbox_airgap_bundle.tar` |

### 1. Launch with Docker Compose (Single Command)
```bash
# Clone the repository
git clone https://github.com/ByteBeast-1/sih117.git
cd sih117

# Build and start all services
docker compose up -d --build

# Verify container health
docker compose ps
```

### 2. Loading the Air-Gapped Offline Bundles (Zero Internet)
```bash
# Step A: Load the offline image bundles on target machine
docker load -i sovereign_backend_bundle.tar
docker load -i sovereign_frontend_bundle.tar
docker load -i sovereign_sandbox_airgap_bundle.tar

# Step B: Start containers without needing Docker registry access
docker compose up -d
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Python:** 3.10+
- **Node.js:** 18+
- **Docker Desktop:** Installed and running
- **Ollama:** Installed from [ollama.com](https://ollama.com) (with models `qwen2.5:3b` and `qwen2.5-coder:1.5b`)

### 2. Running Locally

**Terminal 1 — Local Model Server (Ollama):**
```bash
ollama serve
```

**Terminal 2 — FastAPI Backend (Port 8000):**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate       # On Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 3 — React Client Portal (Port 3000):**
```bash
cd frontend
npm install
npm run dev
```

### 3. Service URLs & Personas
- **Frontend Portal:** `http://localhost:3000`
- **Backend API & Swagger:** `http://localhost:8000/docs`
- **Model Server:** `http://localhost:11434`

| Persona | Username | Password | Role Description |
|---|---|---|---|
| **Process Engineer** | `eng_rajesh` | `engineer123` | Full access to Supervisor, Analyser, Generator, Sandbox, and Artifacts |
| **System Administrator** | `admin` | `admin123` | Access to Admin Console, Model Registry, Diagnostics, and Audit Logs |

---

## 🔒 Air-Gap Verification for Evaluators

Evaluators and judges can independently audit the system's air-gap integrity:

1. **Physical Disconnect (Airplane Mode):**  
   Disconnect the laptop from Wi-Fi and unplug all ethernet cables. Ingest documents, query the Supervisor, run sandbox scripts, and generate PDF deliverables. The entire system executes seamlessly without network dependencies.
2. **Browser Network Audit (F12):**  
   Open Developer Tools &rarr; Network tab in Chrome or Edge. Trigger any action across the workbench. 100% of network traffic routes strictly to `localhost:3000`, `localhost:8000`, or `localhost:11434`. Zero requests reach external cloud endpoints.
3. **Sandbox Kernel Isolation:**  
   Execute socket code within the Code Sandbox:
   ```python
   import urllib.request
   urllib.request.urlopen("https://google.com")
   ```
   The Docker container kernel rejects the connection immediately (`Network is unreachable`), proving the enforcement of `--network none`.

---

## ⚖️ Sovereign Engineering Principles

This project strictly adheres to industrial-grade sovereign engineering standards:

1. **Production-Ready Architecture:** Clean configuration-driven architecture; model names, paths, and thresholds are dynamically resolved rather than hardcoded.
2. **Deterministic, Real Code:** Zero fake stubs or synthetic mockups dressed up as features; real Docker containers, real SQLite database transactions, real compiled document deliverables.
3. **Zero Outbound Internet Calls:** Absolute air-gap compliance. No cloud fallbacks, no telemetry, no third-party CDN assets.
4. **Document Grounding & Verifiable Citations:** Every answer cites local documents, pages, and subtopics; deterministic mathematical proofs with step-by-step audit traces.

---

## 👥 Primary Repositories & Team

- **Primary Production Repository:** [https://github.com/ByteBeast-1/sih117](https://github.com/ByteBeast-1/sih117)
- **Reference Architecture Repository:** [https://github.com/SakthiCharukeshS/SIH26-Workbench](https://github.com/SakthiCharukeshS/SIH26-Workbench)
- **Team:** ByteBeast (SIH 2026)
- **License:** Proprietary & Confidential — Mangalore Refinery and Petrochemicals Limited (MRPL)
