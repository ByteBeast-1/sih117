# Contracts — Full-Stack ↔ Agents/AI

This is the **only** contract this phase needs. It's owned jointly by whoever's building
Full-Stack and whoever's building Agents/AI — update it together, in a quick PR, whenever a
live decision changes something (see `STRUCTURE_GUIDE.md` Section 5 for the process).

All calls below are made by Full-Stack's FastAPI backend to the Agents/AI service (internal
network only, e.g. `http://agents-service:9000`), never directly from the browser.

## 1. General Knowledge Agent (RAG Chat)

`POST /internal/agents/knowledge/ask`

```json
// REQUEST
{ "query": "What is the max operating pressure for 500mm class pipes?", "user_id": "eng_123" }

// RESPONSE
{
  "answer": "The SOP specifies a maximum operating pressure of 12 MPa for 500mm class pipes.",
  "thinking_trace": ["Searched local knowledge base for '500mm pipe pressure'", "Found match in Pressure_Safety_SOP_v3.pdf", "Confirmed value against page 12 table"],
  "citations": [{ "document": "Pressure_Safety_SOP_v3.pdf", "page": 12, "subtopic": "Section 4.2 - Pressure Class Limits" }],
  "grounded": true
}
```

`"grounded": false` means the knowledge base had no relevant match — the frontend must display
this as "no answer found in organization documents," never hide it or let the model guess.

## 2. Math / Calculation Agent

`POST /internal/agents/math/calculate`

```json
// REQUEST
{ "prompt": "Calculate hoop stress for a 500mm pipe at 12 MPa internal pressure.", "user_id": "eng_123" }

// RESPONSE
{
  "final_answer": "Hoop stress ≈ 150 MPa",
  "steps": ["Formula: σ = (P × D) / (2 × t)", "Substituting P=12MPa, D=500mm, t=20mm", "σ = (12 × 500) / (2 × 20) = 150 MPa"],
  "grounded": true,
  "citations": [{ "document": "Engineering_Formulas_Handbook.pdf", "page": 4, "subtopic": "Hoop Stress Formula" }]
}
```

## 3. Supervisor / Coding Workspace Agent

`POST /internal/agents/supervisor/message` (also see `03-supervisor-coding-workspace/README.md`)

```json
// REQUEST
{
  "message": "Add error handling to this script and run it",
  "uploaded_files": [{ "filename": "calc.py", "content_base64": "..." }],
  "user_id": "eng_123"
}

// RESPONSE
{
  "reply": "I've added a try/except block around the file read. Running it now...",
  "proposed_file_edits": [{ "filename": "calc.py", "diff": "...", "requires_confirmation": true }],
  "routed_to_agent": null,          // set to "generation" | "math" | "knowledge" | "vision" if this
                                      // message was actually routed elsewhere
  "sandbox_result": { "success": true, "stdout": "42\n", "stderr": "", "exit_code": 0 }
}
```

**`requires_confirmation: true` is non-negotiable** — the frontend must show the diff and get an
explicit user click before the edit is applied. This matches `NON_NEGOTIABLES.md` rule (a)/(b)
spirit: no silent file changes, ever.

**Live streaming (WebSocket):** `wss://<host>/ws/supervisor/{session_id}` pushes incremental
`thinking`/`sandbox_output` messages as they happen, for the "Run" window described in
sub-phase 3.

## 4. Generation Agent (called indirectly — see note)

The frontend never calls this directly. Any agent response above may include a
`"routed_to_agent": "generation"` — when that happens, poll:

`GET /internal/agents/generation/status/{task_id}`

```json
{
  "status": "completed",
  "generated_files": [{ "filename": "approval_note.docx", "download_url": "/api/v1/deliverables/{task_id}/approval_note.docx" }]
}
```

## 5. Blueprint / Schematic Agent

`POST /internal/agents/vision/analyze` (multipart: `file`, `instruction`)

```json
{
  "extracted_summary": "P&ID shows a 500mm pipe run through valve V-204...",
  "structured_fields": { "equipment_tags": ["V-204"], "pressure_readings_mpa": [12] },
  "yield_prediction": { "estimated_yield_pct": 87.4, "note": "Prototype placeholder model" },
  "citations": [{ "document": "uploaded_pid_scan.pdf", "page": 1 }]
}
```

## 6. Admin — Model Registry

`GET /internal/agents/registry/models`

```json
{ "models": [
  { "name": "qwen2.5:7b-instruct", "role": "reasoning", "status": "loaded" },
  { "name": "qwen2.5-coder:7b", "role": "coding", "status": "loaded" }
] }
```

`POST /internal/agents/registry/models` — `{ "name": "...", "role": "..." }` registers a new
model for routing without redeploying anything (this is the extension point from
`README.md` Section 5.2).

## 7. Network Monitor Feed

`GET /internal/infra/network-status` (this phase's backend actually calls DevOps/Infra for this
one, not Agents/AI — see `phases/02-agents-ai/CONTRACTS.md` for how Agents forwards it, or call
DevOps directly if that's simpler for your setup)

```json
{ "outbound_bytes_total": 0, "measured_at": "2026-09-02T10:00:00Z" }
```

## Universal Error Shape

```json
{ "error": true, "code": "AGENT_UNAVAILABLE", "message": "The knowledge agent did not respond in time." }
```
