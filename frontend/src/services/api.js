import { mockResponses } from '../mocks/agents'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Centralized API client — reads VITE_USE_MOCKS to decide whether
 * to return static mock data or hit the real FastAPI backend.
 * All request/response shapes match CONTRACTS.md exactly.
 */
class ApiClient {
  constructor() {
    this.baseUrl = API_BASE
  }

  // Attach JWT token to every request
  _headers() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  async _fetch(path, options = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: { ...this._headers(), ...options.headers },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(err.message || err.detail || `HTTP ${res.status}`)
    }
    return res.json()
  }

  // ─── Auth ───
  async login(username, password) {
    if (USE_MOCKS) return mockResponses.login(username, password)
    return this._fetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async getMe() {
    if (USE_MOCKS) return mockResponses.me()
    return this._fetch('/api/v1/auth/me')
  }

  // ─── Unified Agent Chat (Supervisor routes to the right agent) ───
  async sendMessage(message, uploadedFiles = [], sessionId = 'default') {
    if (USE_MOCKS) return mockResponses.supervisorMessage(message, uploadedFiles)
    return this._fetch('/api/v1/agents/supervisor/message', {
      method: 'POST',
      body: JSON.stringify({ message, uploaded_files: uploadedFiles, session_id: sessionId }),
    })
  }

  // ─── Multi-Document Upload for Analyzer Agent ───
  async uploadDocuments(files, sessionId = 'analyzer') {
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    formData.append('session_id', sessionId)
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${this.baseUrl}/api/v1/agents/upload-documents`, {
      method: 'POST',
      headers,
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Document upload failed' }))
      throw new Error(err.message || err.detail || `HTTP ${res.status}`)
    }
    return res.json()
  }

  // ─── Knowledge Agent (direct, if needed) ───
  async askKnowledge(query) {
    if (USE_MOCKS) return mockResponses.knowledgeAsk(query)
    return this._fetch('/api/v1/agents/knowledge/ask', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  }

  // ─── Math Agent ───
  async calculateMath(prompt) {
    if (USE_MOCKS) return mockResponses.mathCalculate(prompt)
    return this._fetch('/api/v1/agents/math/calculate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    })
  }

  // ─── Vision / Blueprint Agent ───
  async analyzeVision(file, instruction) {
    if (USE_MOCKS) return mockResponses.visionAnalyze()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('instruction', instruction)
    return fetch(`${this.baseUrl}/api/v1/agents/vision/analyze`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    }).then(r => r.json())
  }

  // ─── Generation Status ───
  async getGenerationStatus(taskId) {
    if (USE_MOCKS) return mockResponses.generationStatus(taskId)
    return this._fetch(`/api/v1/agents/generation/status/${taskId}`)
  }

  // ─── Admin: Model Registry ───
  async getModels() {
    if (USE_MOCKS) return mockResponses.modelRegistry()
    return this._fetch('/api/v1/admin/models')
  }

  async addModel(name, role) {
    if (USE_MOCKS) return mockResponses.addModel(name, role)
    return this._fetch('/api/v1/admin/models', {
      method: 'POST',
      body: JSON.stringify({ name, role }),
    })
  }

  // ─── Admin: Network Monitor ───
  async getNetworkStatus() {
    if (USE_MOCKS) return mockResponses.networkStatus()
    return this._fetch('/api/v1/admin/network-status')
  }

  // ─── Admin: Server Health ───
  async getServerHealth() {
    if (USE_MOCKS) return mockResponses.serverHealth()
    return this._fetch('/api/v1/admin/health')
  }

  // ─── Audit Trail ───
  async getAuditTrail() {
    if (USE_MOCKS) return mockResponses.auditTrail()
    return this._fetch('/api/v1/audit/trail')
  }

  // ─── Sandbox Execute ───
  async executeCode(code, timeoutSeconds = 30) {
    if (USE_MOCKS) return mockResponses.sandboxExecute(code)
    return this._fetch('/api/v1/agents/supervisor/execute', {
      method: 'POST',
      body: JSON.stringify({ code, timeout_seconds: timeoutSeconds }),
    })
  }
}

export const apiClient = new ApiClient()
