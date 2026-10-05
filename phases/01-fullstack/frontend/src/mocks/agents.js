/**
 * Mock responses matching CONTRACTS.md shapes exactly.
 * Used when VITE_USE_MOCKS=true (development without the real Agents/AI backend).
 * Every field name matches the contract — do not invent new fields.
 */

// Simulates network delay for realistic feel
const delay = (ms) => new Promise(r => setTimeout(r, ms))

/**
 * Detect intent from a user message and return the appropriate agent route.
 * In production, the Supervisor LangGraph agent does this. In mock mode we
 * use simple keyword matching as a placeholder.
 */
function detectIntent(message) {
  const msg = message.toLowerCase()
  if (msg.includes('calculate') || msg.includes('stress') || msg.includes('formula') || msg.includes('pressure') || msg.includes('mpa')) {
    return 'math'
  }
  if (msg.includes('run') || msg.includes('execute') || msg.includes('code') || msg.includes('script') || msg.includes('python')) {
    return 'coding'
  }
  if (msg.includes('generate') || msg.includes('docx') || msg.includes('pptx') || msg.includes('report') || msg.includes('approval note')) {
    return 'generation'
  }
  if (msg.includes('blueprint') || msg.includes('p&id') || msg.includes('schematic') || msg.includes('diagram') || msg.includes('drawing')) {
    return 'vision'
  }
  if (msg.includes('sop') || msg.includes('manual') || msg.includes('what is') || msg.includes('policy') || msg.includes('procedure')) {
    return 'knowledge'
  }
  return 'knowledge' // Default to RAG knowledge agent
}

export const mockResponses = {
  // ─── Auth ───
  login: async (username, password) => {
    await delay(600)
    const users = {
      admin: { id: 1, username: 'admin', role: 'admin', department: 'IT Administration' },
      eng_rajesh: { id: 2, username: 'eng_rajesh', role: 'engineer', department: 'Process Engineering' },
      eng_priya: { id: 3, username: 'eng_priya', role: 'engineer', department: 'Mechanical Engineering' },
      operator_kumar: { id: 4, username: 'operator_kumar', role: 'operator', department: 'Plant Operations' },
    }
    const validPasswords = { admin: 'admin123', eng_rajesh: 'engineer123', eng_priya: 'engineer123', operator_kumar: 'operator123' }
    if (!users[username] || validPasswords[username] !== password) {
      throw new Error('Invalid credentials. Please check your Employee ID and password.')
    }
    return { user: users[username], token: 'mock-jwt-token-' + username }
  },

  me: async () => ({ id: 2, username: 'eng_rajesh', role: 'engineer', department: 'Process Engineering' }),

  // ─── Supervisor Message (auto-routing) ───
  supervisorMessage: async (message, uploadedFiles) => {
    await delay(1200)
    const intent = detectIntent(message)

    const responses = {
      knowledge: {
        reply: 'According to the MRPL Standard Operating Procedure for Pressure Safety (SOP-MRPL-PS-2024), the maximum operating pressure for 500mm class pipes in the CDU section is 12 MPa. This limit applies under standard operating temperatures (up to 350°C). For temperatures exceeding 350°C, the derated limit of 10.5 MPa applies per Section 4.2.3.',
        routed_to_agent: 'knowledge',
        thinking_trace: [
          'Analyzing query: extracting key terms — "500mm", "pressure", "pipe"',
          'Searching local knowledge base (ChromaDB) for relevant SOPs...',
          'Found 3 matching documents, ranking by relevance...',
          'Top match: Pressure_Safety_SOP_v3.pdf (confidence: 0.94)',
          'Extracting answer from Section 4.2, Page 12, Table 4-1',
          'Cross-referencing with Engineering_Formulas_Handbook.pdf for validation',
        ],
        citations: [
          { document: 'Pressure_Safety_SOP_v3.pdf', page: 12, subtopic: 'Section 4.2 - Pressure Class Limits' },
          { document: 'CDU_Operating_Manual.pdf', page: 45, subtopic: 'Section 7.1 - Pipe Specifications' },
        ],
        grounded: true,
        proposed_file_edits: null,
        sandbox_result: null,
      },
      math: {
        reply: 'The hoop stress for a 500mm pipe at 12 MPa internal pressure with 20mm wall thickness is **150 MPa**. This is within the allowable limit of 170 MPa specified in the MRPL Engineering Standards.',
        routed_to_agent: 'math',
        thinking_trace: [
          'Identified calculation type: Hoop Stress (thin-wall pressure vessel)',
          'Retrieving formula from Engineering_Formulas_Handbook.pdf...',
          'Formula: σ_h = (P × D) / (2 × t)',
          'Substituting: P = 12 MPa, D = 500 mm, t = 20 mm',
          'Calculating: σ_h = (12 × 500) / (2 × 20) = 150 MPa',
          'Cross-checking against SOP allowable limit: 170 MPa ✓',
        ],
        citations: [
          { document: 'Engineering_Formulas_Handbook.pdf', page: 4, subtopic: 'Hoop Stress Formula' },
          { document: 'MRPL_Material_Standards.pdf', page: 18, subtopic: 'Allowable Stress Table A-3' },
        ],
        grounded: true,
        steps: [
          'Formula: σ_h = (P × D) / (2 × t)',
          'Where: P = Internal Pressure, D = Pipe Diameter, t = Wall Thickness',
          'Substituting: P = 12 MPa, D = 500 mm, t = 20 mm',
          'σ_h = (12 × 500) / (2 × 20)',
          'σ_h = 6000 / 40',
          'σ_h = 150 MPa',
          '✓ Within allowable limit of 170 MPa (Safety Factor: 1.13)',
        ],
        safety_check: {
          parameter: 'Hoop Stress',
          calculated_value: 150,
          sop_limit: 170,
          unit: 'MPa',
          status: 'safe',
          sop_reference: 'MRPL_Material_Standards.pdf, Table A-3',
        },
        proposed_file_edits: null,
        sandbox_result: null,
      },
      coding: {
        reply: 'I\'ve added error handling to your script with a try/except block around the file read operation. I\'ll run it in the sandbox to verify.',
        routed_to_agent: 'coding',
        thinking_trace: [
          'Analyzing uploaded script: calc.py',
          'Identified missing error handling around file I/O operations',
          'Generating fix: wrapping lines 5-12 in try/except block',
          'Preparing sandbox execution request...',
          'Sandbox returned: exit code 0, output captured',
        ],
        citations: [],
        grounded: false,
        proposed_file_edits: [{
          filename: 'calc.py',
          diff: `--- a/calc.py\n+++ b/calc.py\n@@ -3,6 +3,10 @@\n def calculate_stress(p, d, t):\n-    data = open("values.csv").read()\n-    result = (p * d) / (2 * t)\n-    return result\n+    try:\n+        data = open("values.csv").read()\n+        result = (p * d) / (2 * t)\n+        return result\n+    except FileNotFoundError:\n+        print("Error: values.csv not found")\n+        return None`,
          requires_confirmation: true,
        }],
        sandbox_result: { success: true, stdout: 'Hoop Stress = 150.0 MPa\n', stderr: '', exit_code: 0 },
      },
      generation: {
        reply: 'I\'m generating an approval note document based on the inspection findings. Routing to the Generation Agent...',
        routed_to_agent: 'generation',
        thinking_trace: [
          'Detected document generation request',
          'Routing to Generation Agent (docx format)',
          'Compiling inspection data and findings...',
          'Generating MRPL-format NFA (Note for Approval)...',
          'Document ready for download',
        ],
        citations: [
          { document: 'Inspection_Report_C301_Aug2026.pdf', page: 3, subtopic: 'Key Findings Summary' },
        ],
        grounded: true,
        generated_files: [{
          filename: 'NFA_C301_Inspection_Sep2026.docx',
          download_url: '/api/v1/deliverables/mock-task-001/NFA_C301_Inspection_Sep2026.docx',
          size_kb: 142,
        }],
        proposed_file_edits: null,
        sandbox_result: null,
      },
      vision: {
        reply: 'I\'ve analyzed the uploaded P&ID schematic. Found 4 equipment tags, 2 control valves, and 1 pressure indicator. The estimated yield prediction for this configuration is 87.4%.',
        routed_to_agent: 'vision',
        thinking_trace: [
          'Processing uploaded document with local vision model...',
          'Detected P&ID schematic format',
          'Extracting equipment tags and instrument codes...',
          'Cross-referencing tags with CDU Equipment Database...',
          'Running yield prediction model on extracted configuration...',
        ],
        citations: [
          { document: 'uploaded_pid_scan.pdf', page: 1, subtopic: 'P&ID Sheet 1' },
        ],
        grounded: true,
        extracted_summary: 'P&ID shows a 500mm pipe run from Distillation Column C-301 through Control Valve CV-204 to Heat Exchanger E-102. Pressure transmitter PT-301 reads 11.8 MPa at column outlet.',
        structured_fields: {
          equipment_tags: ['C-301', 'CV-204', 'E-102', 'PT-301'],
          pressure_readings_mpa: [11.8],
          temperature_readings_c: [345],
          pipe_sizes_mm: [500, 300],
        },
        yield_prediction: { estimated_yield_pct: 87.4, note: 'Prototype placeholder model — accuracy improves with real training data' },
        proposed_file_edits: null,
        sandbox_result: null,
      },
    }

    return responses[intent] || responses.knowledge
  },

  // ─── Direct Agent Calls ───
  knowledgeAsk: async (query) => {
    await delay(800)
    return {
      answer: 'The SOP specifies a maximum operating pressure of 12 MPa for 500mm class pipes.',
      thinking_trace: ['Searched local knowledge base', 'Found match in Pressure_Safety_SOP_v3.pdf', 'Confirmed value against page 12 table'],
      citations: [{ document: 'Pressure_Safety_SOP_v3.pdf', page: 12, subtopic: 'Section 4.2 - Pressure Class Limits' }],
      grounded: true,
    }
  },

  mathCalculate: async (prompt) => {
    await delay(1000)
    return {
      final_answer: 'Hoop stress ≈ 150 MPa',
      steps: ['Formula: σ = (P × D) / (2 × t)', 'Substituting P=12MPa, D=500mm, t=20mm', 'σ = (12 × 500) / (2 × 20) = 150 MPa'],
      grounded: true,
      citations: [{ document: 'Engineering_Formulas_Handbook.pdf', page: 4, subtopic: 'Hoop Stress Formula' }],
    }
  },

  visionAnalyze: async () => {
    await delay(1500)
    return {
      extracted_summary: 'P&ID shows a 500mm pipe run through valve V-204...',
      structured_fields: { equipment_tags: ['V-204', 'C-301', 'E-102'], pressure_readings_mpa: [12] },
      yield_prediction: { estimated_yield_pct: 87.4, note: 'Prototype placeholder model' },
      citations: [{ document: 'uploaded_pid_scan.pdf', page: 1, subtopic: 'P&ID Sheet 1' }],
    }
  },

  generationStatus: async (taskId) => {
    await delay(500)
    return {
      status: 'completed',
      generated_files: [{ filename: 'approval_note.docx', download_url: `/api/v1/deliverables/${taskId}/approval_note.docx` }],
    }
  },

  sandboxExecute: async (code) => {
    await delay(2000)
    if (code.includes('socket') || code.includes('http') || code.includes('requests')) {
      return { success: false, stdout: '', stderr: 'OSError: [Errno 101] Network is unreachable — sandbox has network_mode="none"', exit_code: 1 }
    }
    if (code.includes('while True')) {
      return { success: false, stdout: '', stderr: 'Execution timed out after 10s', exit_code: 1 }
    }
    return { success: true, stdout: 'Output: 150.0 MPa\nCalculation complete.\n', stderr: '', exit_code: 0 }
  },

  // ─── Admin ───
  modelRegistry: async () => {
    await delay(400)
    return {
      models: [
        { name: 'qwen2.5:7b-instruct', role: 'reasoning', status: 'loaded', vram_mb: 4800 },
        { name: 'qwen2.5-coder:7b', role: 'coding', status: 'loaded', vram_mb: 4600 },
        { name: 'bge-base-en-v1.5', role: 'embedding', status: 'loaded', vram_mb: 420 },
        { name: 'qwen2-vl:7b', role: 'vision', status: 'standby', vram_mb: 5200 },
      ],
    }
  },

  addModel: async (name, role) => {
    await delay(600)
    return { name, role, status: 'loading' }
  },

  networkStatus: async () => ({
    outbound_bytes_total: 0,
    inbound_lan_bytes: 284719,
    measured_at: new Date().toISOString(),
    blocked_attempts: [
      { timestamp: '2026-09-04T09:15:22Z', destination: '142.250.190.14 (google.com)', action: 'BLOCKED' },
      { timestamp: '2026-09-04T08:42:11Z', destination: '13.107.42.14 (microsoft.com)', action: 'BLOCKED' },
    ],
  }),

  serverHealth: async () => ({
    services: [
      { name: 'Frontend (React)', status: 'healthy', port: 3000 },
      { name: 'Backend (FastAPI)', status: 'healthy', port: 8000 },
      { name: 'Agents Service', status: 'healthy', port: 9000 },
      { name: 'Sandbox Service', status: 'healthy', port: 9100 },
      { name: 'ChromaDB', status: 'healthy', port: 8001 },
      { name: 'Ollama', status: 'healthy', port: 11434 },
    ],
    gpu: { utilization_pct: 62, vram_used_mb: 14300, vram_total_mb: 24576, temp_c: 68 },
    connected_users: 3,
    uptime_hours: 47.2,
  }),

  auditTrail: async () => ({
    entries: [
      { id: 1, timestamp: '2026-09-04T09:15:22Z', user: 'eng_rajesh', action: 'knowledge_query', query: 'Max pressure for 500mm pipes', agent: 'knowledge', documents: ['Pressure_Safety_SOP_v3.pdf'], hash: 'a3f2c1...', prev_hash: '000000...' },
      { id: 2, timestamp: '2026-09-04T09:18:45Z', user: 'eng_rajesh', action: 'math_calculation', query: 'Calculate hoop stress at 12 MPa', agent: 'math', documents: ['Engineering_Formulas_Handbook.pdf'], hash: 'b7e4d2...', prev_hash: 'a3f2c1...' },
      { id: 3, timestamp: '2026-09-04T09:25:10Z', user: 'eng_priya', action: 'code_execution', query: 'Run stress calculation script', agent: 'supervisor', documents: [], hash: 'c9a1f3...', prev_hash: 'b7e4d2...' },
      { id: 4, timestamp: '2026-09-04T10:01:33Z', user: 'eng_rajesh', action: 'document_generation', query: 'Generate approval note for C-301', agent: 'generation', documents: ['Inspection_Report_C301.pdf'], hash: 'd2b5e4...', prev_hash: 'c9a1f3...' },
    ],
    chain_valid: true,
  }),
}
