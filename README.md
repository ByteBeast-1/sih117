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
3. [Multi-Phase Project Organization](#-multi-phase-project-organization)
4. [Agent Capabilities & Workflows](#-agent-capabilities--workflows)
5. [Docker Bundle & Air-Gap Deployment](#-docker-bundle--air-gap-deployment)
6. [Quick Start & Local Setup](#-quick-start--local-setup)
7. [Air-Gap Verification for Evaluators](#-air-gap-verification-for-evaluators)
8. [Non-Negotiable Engineering Standards](#-non-negotiable-engineering-standards)
9. [Primary Repositories & Team](#-primary-repositories--team)

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

## 🐳 Docker Bundle & Air-Gap Deployment

The entire system is containerized into a single, cohesive deployment stack.

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

### 2. Creating an Air-Gapped Offline Bundle (for USB Drive Transfer)
For physical deployment to target laptops or servers with **zero internet connectivity**:

```bash
# Step A: On build machine, save images to a tar bundle
docker save \
  sih26-sovereign-workbench-frontend:latest \
  sih26-backend:latest \
  ollama/ollama:latest \
  python:3.10-slim \
  -o sovereign_workbench_airgap_bundle.tar

# Step B: Copy sovereign_workbench_airgap_bundle.tar & docker-compose.yml to USB drive

# Step C: On the offline target machine (with Wi-Fi OFF):
docker load -i sovereign_workbench_airgap_bundle.tar
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

## ⚖️ Non-Negotiable Engineering Standards

This project strictly adheres to the four architectural pillars defined in [`NON_NEGOTIABLES.md`](file:///c:/Users/sande/OneDrive/Desktop/sih/SIH26-Sovereign-Workbench/NON_NEGOTIABLES.md):

1. **Prototype &rarr; Full Product, No Rework Conflicts:** Clean configuration-driven architecture; model names, paths, and thresholds are never hardcoded.
2. **Clean, Efficient, Real Code:** Zero fake stubs or synthetic mockups dressed up as features; real Docker containers, real SQLite database transactions, real compiled documents.
3. **Zero Outbound Internet Calls:** Absolute air-gap compliance. No cloud fallbacks, no telemetry, no third-party CDN assets.
4. **Document Grounding & Verifiable Citations:** Every answer cites local documents, pages, and subtopics; deterministic mathematical proofs with step-by-step audit traces.

---

## 👥 Primary Repositories & Team

- **Primary Production Repository:** [https://github.com/ByteBeast-1/sih117](https://github.com/ByteBeast-1/sih117)
- **Reference Architecture Repository:** [https://github.com/SakthiCharukeshS/SIH26-Workbench](https://github.com/SakthiCharukeshS/SIH26-Workbench)
- **Team:** ByteBeast (SIH 2026)
- **License:** Proprietary & Confidential — Mangalore Refinery and Petrochemicals Limited (MRPL)
