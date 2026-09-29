# API Contracts

All endpoints are served from `http://localhost:8000`. All responses are JSON.

---

## Authentication

### POST `/api/v1/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "user": { "username": "admin", "role": "admin" },
  "token": "<jwt-string>"
}
```

### GET `/api/v1/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "username": "admin", "role": "admin" }
```

---

## Agent Endpoints

### POST `/api/v1/agents/supervisor/message`

The main entry point. Auto-routes to the correct agent.

**Request:**
```json
{
  "message": "What is the max pressure for 500mm pipes?",
  "uploaded_files": []
}
```

**Response (200):**
```json
{
  "reply": "According to the MRPL SOP...",
  "routed_to_agent": "knowledge",
  "thinking_trace": [
    "Analyzing query...",
    "Searching ChromaDB...",
    "Found 3 matching documents..."
  ],
  "citations": [
    {
      "document": "Pressure_Safety_SOP_v3.pdf",
      "page": 12,
      "subtopic": "Section 4.2 - Pressure Class Limits"
    }
  ],
  "grounded": true
}
```

### POST `/api/v1/agents/knowledge/ask`

**Request:**
```json
{ "query": "What are the inspection requirements for pressure vessels?" }
```

### POST `/api/v1/agents/math/calculate`

**Request:**
```json
{ "prompt": "Calculate hoop stress for 500mm pipe at 12 MPa with 20mm wall" }
```

### POST `/api/v1/agents/supervisor/execute`

**Request:**
```json
{
  "code": "print('hello world')",
  "timeout_seconds": 30
}
```

**Response:**
```json
{
  "success": true,
  "stdout": "hello world\n",
  "stderr": "",
  "exit_code": 0
}
```

### POST `/api/v1/agents/vision/analyze`

**Request:** `multipart/form-data` with `file` and `instruction` fields.

---

## Admin Endpoints

### GET `/api/v1/admin/models`
Returns all registered local models with their status.

### GET `/api/v1/admin/health`
Returns server health including CPU, memory, Ollama status.

### GET `/api/v1/admin/network-status`
Returns the zero-outbound-traffic proof.

### GET `/api/v1/admin/audit-trail`
Returns the hash-chained audit log.
