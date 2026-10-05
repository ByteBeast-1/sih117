# Setup Guide — Step by Step
# MRPL Sovereign On-Premise Engineering Workbench

## Quick Start (5 minutes)

### 1. Prerequisites

| Tool | Version | Download | Purpose |
|------|---------|----------|---------|
| Python | 3.10+ | [python.org](https://python.org) | FastAPI backend, LangGraph agent nodes |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) | React 19 / Vite client portal |
| Git | Any | [git-scm.com](https://git-scm.com) | Source versioning |
| Docker Desktop | Latest | [docker.com](https://docker.com) | Air-gapped code sandbox execution |
| Ollama | Latest | [ollama.com](https://ollama.com) | Local GPU LLM inference (`qwen2.5`) |

---

### 2. Backend Setup

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate it
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
.\venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

---

### 4. Setup Local LLM (Ollama)

```bash
# Allow local network/host connectivity:
# Windows (PowerShell):
[System.Environment]::SetEnvironmentVariable('OLLAMA_HOST', '0.0.0.0', 'User')
# Linux:
export OLLAMA_HOST="0.0.0.0"

# Pull local models:
ollama pull qwen2.5:3b
ollama pull qwen2.5-coder:1.5b

# Start Ollama daemon:
ollama serve
```

> **Note:** The workbench is built with intelligent offline fallbacks and local mathematical engines. If Ollama is temporarily stopped or unavailable, all agents gracefully utilize on-premise deterministic engines and structured document generators.

---

### 5. Running the Application

Open 3 terminals on your local machine:

**Terminal 1 — Local LLM Server:**
```bash
ollama serve
```

**Terminal 2 — FastAPI Backend (Port 8000):**
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 3 — React Client Portal (Port 3000):**
```bash
cd frontend
npm run dev
```

---

### 6. Access the Application

- **Frontend Client Portal:** `http://localhost:3000/`
- **Backend API & Swagger Docs:** `http://localhost:8000/docs`
- **Model Server:** `http://localhost:11434`

### 7. Login Personas

| Persona | Username | Password | Access Level |
|---------|----------|----------|--------------|
| **Process Engineer** | `eng_rajesh` | `engineer123` | Full Sovereign Workbench (Chat, Analyser, Generator, Sandbox, Artifacts) |
| **System Administrator** | `admin` | `admin123` | Admin Diagnostics, Model Registry, Audit Logs |

---

## Workspace Features Walkthrough

1. **General Chat (Supervisor):**
   - Natural language queries auto-routed via LangGraph intent classification (`conversational`, `knowledge`, `math`, `analyzer`, `coding`, `generation`, `vision`).
   - Grounded citations from local documents and SOPs.

2. **Analyser Agent:**
   - Multi-file ingestion (PDF, TXT, LOG, CSV, Resumes).
   - Structural text extraction, delta-P checks, and technical entity audits.
   - One-click handoff: **"Send to Generator AI for Report & Live Preview"**.

3. **Generator AI:**
   - Compiles real, downloadable **PDF**, **PowerPoint (PPTX)**, **Excel (XLSX)**, and **LaTeX (.tex)** files.
   - Dual-pane interface with live document preview and Markdown source view.
   - Grounded in analyzed source text (resumes, specs, equipment logs) without forced refinery boilerplate.

4. **Code Sandbox:**
   - Runs untrusted code inside an isolated Docker container (`python:3.10-slim`, `--network none`).
   - Pre-installed scientific packages: `numpy`, `scipy`, `pandas`, `matplotlib`, `sympy`.
   - Automatic import guards to prevent `NameError` on common scientific calls.
   - Dedicated "Verification" tab with live container introspection probe for judges.

5. **Artifacts Library:**
   - Central repository of all compiled deliverables.
   - Format filtering (`All`, `PDF`, `PPTX`, `XLSX`, `LaTeX`), search by title/filename.
   - Quick preview modal, direct download links, and linked session references.

---

## Air-Gap & Security Verification for Judges

To verify that the system is 100% self-hosted and on-premise:

1. **Disconnect Network (Airplane Mode):**
   Turn off Wi-Fi or unplug ethernet. Run queries, analyze uploaded documents, execute Python code in the sandbox, and generate PDF deliverables. The system operates with zero interruption.

2. **Browser Developer Tools (F12) Network Audit:**
   Open Network tab in Chrome/Edge. Filter by external domains. 100% of network traffic routes strictly to `localhost:3000`, `localhost:8000`, and `localhost:11434`. Zero requests reach external APIs (OpenAI, Anthropic, or cloud CDNs).

3. **Docker Network Isolation:**
   Execute any socket code in the Sandbox (`import urllib.request; urllib.request.urlopen("https://google.com")`). The Docker kernel enforces `--network none` and rejects all outbound packets.
