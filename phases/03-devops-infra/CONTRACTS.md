# Contracts — DevOps/Infra's Boundary

## 1. Sandbox Execution Service (called by Agents/AI's Supervisor agent)

`POST /internal/execute` (runs on port 9100, internal network only — never exposed publicly)

```json
// REQUEST
{ "code": "import openpyxl\n...", "timeout_seconds": 30 }

// RESPONSE — success
{ "success": true, "stdout": "Wrote 42 rows to output.xlsx", "stderr": "", "exit_code": 0 }

// RESPONSE — failure (code crashed, or timed out)
{ "success": false, "stdout": "", "stderr": "NameError: name 'foo' is not defined", "exit_code": 1 }
```

**Non-negotiable behavior** (this is `NON_NEGOTIABLES.md` rule (c) made concrete in code):
- Every execution runs in a **new, disposable** container — never reused across requests.
- Container flags, always all four together: `network_mode="none"`, `mem_limit="512m"`,
  `nano_cpus=500_000_000` (0.5 CPU), `read_only=True`, `cap_drop=["ALL"]`.
- If `timeout_seconds` is exceeded, kill the container and return the failure shape with
  `"stderr": "Execution timed out after {timeout_seconds}s"`.
- Any file the script writes lands in a shared volume mounted at `/workspace`, mapped to
  `/shared/outputs/{task_id}/` on the host.

## 2. Docker Compose Service Map

| Service | Exposes | Depends on |
|---|---|---|
| `frontend` | `3000` | `backend` |
| `backend` | `8000` | `postgres`, `agents` |
| `agents` | `9000` (internal only) | `sandbox`, `chromadb`, Ollama (host) |
| `sandbox` | `9100` (internal only) | Docker socket (mounted) |
| `postgres` | `5432` (internal only) | — |
| `chromadb` | `8001` (internal only) | — |

## 3. Network/GPU Metrics Feed

```json
{
  "outbound_bytes_total": 0,
  "measured_at": "2026-09-02T10:00:00Z",
  "gpu": { "utilization_pct": 62, "vram_used_mb": 14300, "vram_total_mb": 24576, "temp_c": 68 }
}
```

`outbound_bytes_total` must come from an actual `tcpdump`/interface-counter check — never
hardcoded. This is the literal proof-of-sovereignty number; faking it defeats the entire point of
the project's central claim.

## 4. Air-Gap Bundle Contents

```
bundle/
  images/            # docker save output for every service image
  docker-compose.yml
  install.sh         # runs `docker load` for every image, then `docker-compose up -d`
  .env.example
```
