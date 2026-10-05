# Docker Deployment & Air-Gap Bundling Guide
# MRPL Sovereign On-Premise Engineering Workbench

This guide details how to bundle and deploy the entire Sovereign Workbench as a **100% self-contained, air-gapped Docker package** that can be transferred via USB to any offline machine.

---

## 📦 What is Included in the Bundle?

1. **Frontend Container (`sovereign-frontend`):** React 19 + Vite compiled into a high-performance, lightweight Nginx web server running on port `3000`.
2. **Backend Container (`sovereign-backend`):** FastAPI orchestrator with LangGraph state routing, SQLite database persistence, and document generators running on port `8000`.
3. **Local LLM Container (`sovereign-ollama`):** Ollama inference daemon running locally on port `11434`.
4. **Code Execution Sandbox:** Subprocess/Docker container (`python:3.10-slim`, `--network none`) with pre-installed scientific libraries (`numpy`, `scipy`, `pandas`, `matplotlib`, `sympy`).

---

## 🚀 Quick Deployment (Single Machine with Docker)

To run the entire multi-container stack with a single command:

```bash
# From the repository root:
docker compose up -d --build
```

Verify that all services are running:
```bash
docker compose ps
```

Visit the services:
- **Client Workbench:** `http://localhost:3000`
- **Backend API & Swagger:** `http://localhost:8000/docs`
- **Ollama Engine:** `http://localhost:11434`

To stop the stack:
```bash
docker compose down
```

---

## 🛡️ Creating an Air-Gapped Offline Bundle (for USB Drive Transfer)

When deploying to a target laptop or server with **zero internet connectivity**, follow these 3 steps:

### Step 1: Build & Export on Connected Machine

```bash
# 1. Build all images locally
docker compose build

# 2. Pull base Ollama and sandbox images
docker pull ollama/ollama:latest
docker pull python:3.10-slim

# 3. Export all images into a single compressed tar archive
docker save \
  sih26-sovereign-workbench-frontend:latest \
  sih26-sovereign-workbench-backend:latest \
  ollama/ollama:latest \
  python:3.10-slim \
  -o sovereign_workbench_airgap_bundle.tar
```

### Step 2: Copy to USB Drive

Copy the following files to your external USB storage:
- `sovereign_workbench_airgap_bundle.tar`
- `docker-compose.yml`
- Model files (if pre-downloading Ollama weights from `~/.ollama/models`)

### Step 3: Load & Run on Target Air-Gapped Laptop

On the target machine (even with airplane mode enabled):

```bash
# 1. Load the images into Docker
docker load -i sovereign_workbench_airgap_bundle.tar

# 2. Launch the entire sovereign stack
docker compose up -d

# 3. Confirm all services are healthy
docker compose ps
```

---

## ⚡ GPU Acceleration (NVIDIA RTX 3050 or Data Center GPUs)

To enable GPU passthrough to the Ollama container in Docker:
1. Ensure the **NVIDIA Container Toolkit** is installed.
2. In `docker-compose.yml`, uncomment the `deploy` block under the `ollama` service:
   ```yaml
   deploy:
     resources:
       reservations:
         devices:
           - driver: nvidia
             count: all
             capabilities: [gpu]
   ```
3. Run `docker compose up -d`. Ollama will automatically utilize the GPU VRAM for instant token generation.
