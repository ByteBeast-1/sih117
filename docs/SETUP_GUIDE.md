# Setup Guide — Step by Step

## Quick Start (5 minutes)

### 1. Install Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Git | Any | [git-scm.com](https://git-scm.com) |
| Ollama | Latest | [ollama.com](https://ollama.com) (optional) |

### 2. Clone & Setup Backend

```bash
git clone <repo-url>
cd SIH26-Sovereign-Workbench

# Create Python virtual environment
cd backend
python -m venv venv

# Activate it
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

### 4. (Optional) Setup Ollama for LLM Inference

```bash
# Download from https://ollama.com and install
# Set OLLAMA_HOST for LAN access:
# Windows: setx OLLAMA_HOST "0.0.0.0"
# Linux: export OLLAMA_HOST="0.0.0.0"

# Pull the models:
ollama pull qwen2.5:1.5b
ollama pull qwen2.5-coder:1.5b

# Verify:
ollama list
```

> **Note:** The backend works perfectly without Ollama — it uses intelligent fallback
> logic with built-in engineering knowledge. Ollama adds real LLM inference on top.

### 5. Run Everything

**Terminal 1 — Backend:**
```bash
cd backend
.\venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Open in Browser

- Frontend: **http://localhost:5173**
- Backend API Docs: **http://localhost:8000/docs**

### 7. Login

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin (sees Admin Dashboard) |
| `eng_rajesh` | `engineer123` | Engineer (sees Client Workbench) |

---

## Troubleshooting

### "Ollama not reachable" warning in backend logs
This is normal if Ollama isn't running. The backend will use its built-in knowledge engine and engineering calculator. To enable full LLM inference, start Ollama first.

### Frontend shows "Network Error"
Make sure the backend is running on port 8000. Check that the frontend `.env` has:
```
VITE_API_BASE_URL=http://localhost:8000
```

### ChromaDB downloading model on first start
The first startup downloads the `all-MiniLM-L6-v2` embedding model (~80MB). Subsequent starts are instant.

### Port already in use
Kill existing processes: `netstat -ano | findstr :8000` then `taskkill /PID <pid> /F`
