import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Upload, Brain, Activity, CheckCircle2, ChevronRight, BarChart2, CheckSquare } from 'lucide-react'
import ClientSidebar from '../components/layout/ClientSidebar'

export default function AnalyzerAgent() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Right side panel state
  const [thinkingPlan, setThinkingPlan] = useState([])
  const [checks, setChecks] = useState([])
  
  // Middle section state (Graphs/Visuals)
  const [activeTab, setActiveTab] = useState('overview')
  const [showVisuals, setShowVisuals] = useState(false)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const uploadMsg = { id: Date.now(), role: 'user', content: `📎 Uploaded for Analysis: ${file.name}` }
    setMessages(prev => [...prev, uploadMsg])
    
    setIsProcessing(true)
    simulateAnalysis(file.name)
  }

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMsg = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsProcessing(true)
    simulateAnalysis(userMsg.content)
  }

  const simulateAnalysis = async (query) => {
    // Reset states
    setShowVisuals(true)
    setThinkingPlan([
      { id: 1, text: 'Phase 1: Ingesting file and parsing structure...', status: 'loading' }
    ])
    setChecks([
      { id: 'math', label: 'Math Derivations Check', status: 'pending' },
      { id: 'concept', label: 'Core Concepts Check', status: 'pending' },
      { id: 'pipeline', label: 'Pipeline Validity Check', status: 'pending' },
    ])

    await new Promise(r => setTimeout(r, 1000))
    setThinkingPlan(prev => [
      { id: 1, text: 'Phase 1: Ingesting file and parsing structure...', status: 'done' },
      { id: 2, text: 'Phase 2: Calling specialized sub-agent for extraction...', status: 'loading' }
    ])
    setChecks(prev => prev.map(c => c.id === 'concept' ? { ...c, status: 'validating' } : c))

    await new Promise(r => setTimeout(r, 1200))
    setThinkingPlan(prev => [
      ...prev.slice(0, 1),
      { id: 2, text: 'Phase 2: Extraction complete (Sub-agent returned).', status: 'done' },
      { id: 3, text: 'Phase 3: Verifying math and structural logic...', status: 'loading' }
    ])
    setChecks(prev => prev.map(c => {
      if (c.id === 'concept') return { ...c, status: 'pass' }
      if (c.id === 'math') return { ...c, status: 'validating' }
      return c
    }))

    await new Promise(r => setTimeout(r, 1200))
    setThinkingPlan(prev => [
      ...prev.slice(0, 2),
      { id: 3, text: 'Phase 3: Math validation complete.', status: 'done' },
      { id: 4, text: 'Phase 4: Generating structured response...', status: 'done' }
    ])
    setChecks(prev => prev.map(c => {
      if (c.id === 'math') return { ...c, status: 'pass' }
      if (c.id === 'pipeline') return { ...c, status: 'pass' }
      return c
    }))

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: 'assistant',
      content: `**Structured Analysis Result**\n\nThe input "${query}" has been analyzed successfully.\n\n**Key Findings:**\n- All math derivations align with standard API codes.\n- Conceptual architecture is sound.\n- Pipeline flow matches the expected DAG execution.\n\nWould you like me to generate a detailed report from these findings?`,
      showGenerateBtn: true
    }])
    setIsProcessing(false)
  }

  return (
    <div className="flex h-screen bg-surface-100 text-slate-100 overflow-hidden font-sans">
      <ClientSidebar />

      {/* Main Chat/Input Area (Left/Center) */}
      <div className="flex-1 flex flex-col relative bg-surface-100 border-r border-surface-300/50 min-w-[400px]">
        <div className="px-6 py-4 border-b border-surface-300/50 flex justify-between items-center bg-surface-200/30">
          <div>
            <h1 className="text-lg font-medium text-slate-200">Analyser Agent</h1>
            <p className="text-xs text-slate-500">Upload PDFs, PPTs, Excel, diagrams, or logs for deep structural analysis.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 w-64 h-40 rounded-2xl border-2 border-dashed border-surface-400 bg-surface-200/30 hover:bg-surface-300/50 hover:border-amber-500/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">Upload File for Analysis</span>
                <span className="text-xs text-slate-500 text-center px-4">PDF, PPT, Excel, Handwritten notes, Flowcharts</span>
              </button>
              <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.txt,.log" onChange={handleFileUpload} className="hidden" />
            </div>
          ) : (
            <div className="space-y-6 w-full pb-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-full max-w-[90%] space-y-3">
                      <div className="bg-surface-200/50 text-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm border border-surface-300 shadow-sm whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      {msg.showGenerateBtn && (
                        <button
                          onClick={() => navigate('/generator')}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-sm transition-colors"
                        >
                          <FileOutput className="w-4 h-4" />
                          Send to Generator AI for Report
                        </button>
                      )}
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="bg-sovereign-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md max-w-[85%] break-words">{msg.content}</div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-surface-100 flex justify-center border-t border-surface-300/50">
          <div className="w-full relative bg-surface-200 rounded-2xl border border-surface-300 focus-within:border-slate-500 transition-colors shadow-sm">
            <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-amber-400 transition-colors">
                <Upload className="w-4 h-4" />
              </button>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="Ask a question or upload a file to analyze..." className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-sm resize-none min-h-[24px] max-h-[120px] py-1" rows={1} />
              <button type="submit" disabled={!input.trim() && !isProcessing} className="p-2 rounded-full bg-surface-300 text-slate-300 hover:bg-surface-400 disabled:opacity-50 transition-colors">
                {isProcessing ? <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Middle Section (Visuals / Graphs) */}
      {showVisuals && (
        <div className="w-[400px] border-r border-surface-300/50 bg-[#161618] flex flex-col shrink-0">
          <div className="flex px-4 pt-4 border-b border-surface-300 gap-4">
            <button onClick={() => setActiveTab('overview')} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Visuals</button>
            <button onClick={() => setActiveTab('data')} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Raw Data</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'overview' ? (
              <div className="h-64 rounded-xl border border-surface-300 bg-surface-200/50 flex flex-col items-center justify-center gap-3">
                <BarChart2 className="w-10 h-10 text-slate-500" />
                <span className="text-sm text-slate-400">Analysis Graph / Extracted Flowchart</span>
                <span className="text-xs text-slate-500 px-8 text-center">(Interactive charts render here using Antigravity artifacts layout)</span>
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-400 whitespace-pre-wrap bg-surface-200 p-4 rounded-lg">
                {`{\n  "status": "extracted",\n  "confidence": 0.94,\n  "nodes_detected": 14,\n  "equations_verified": 3\n}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right: Thinking Plan & Checks */}
      <div className="w-[320px] bg-[#1a1a1a] flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-surface-300 flex items-center gap-2 bg-surface-200/30">
          <Brain className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-medium text-slate-200">Execution Plan</h2>
        </div>
        
        {/* Thinking Steps */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {thinkingPlan.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-slate-500 opacity-50">
              <p className="text-xs text-center">Awaiting analysis task...</p>
            </div>
          ) : (
            thinkingPlan.map((step, idx) => (
              <div key={step.id} className="flex gap-3 relative animate-fade-in">
                {idx !== thinkingPlan.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-[-16px] w-[2px] bg-surface-300" />
                )}
                <div className="shrink-0 relative z-10 bg-[#1a1a1a] mt-0.5">
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                  )}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`text-xs ${step.status === 'done' ? 'text-slate-300' : 'text-amber-300 animate-pulse'}`}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Validation Checks */}
        <div className="p-4 border-t border-surface-300 bg-surface-200/20">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Validation Checks</h3>
          <div className="space-y-2">
            {checks.map(check => (
              <div key={check.id} className="flex justify-between items-center text-sm bg-surface-200/50 p-2 rounded-lg border border-surface-300">
                <span className="text-slate-300 text-xs flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                  {check.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  check.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' :
                  check.status === 'validating' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                  'bg-surface-300 text-slate-500'
                }`}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
