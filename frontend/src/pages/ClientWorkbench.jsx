import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Mic, Camera, BrainCircuit, CheckCircle2, ChevronRight, Activity } from 'lucide-react'
import ClientSidebar from '../components/layout/ClientSidebar'
import AgentExploreGrid from '../components/chat/AgentExploreGrid'
import { apiClient } from '../services/api'

const AGENT_ROUTES = [
  { keywords: ['analyze', 'pdf', 'ppt', 'excel', 'notes', 'log', 'architecture', 'diagram', 'flowchart'], agent: 'Analyser Agent', path: '/analyzer' },
  { keywords: ['code', 'python', 'script', 'execute', 'sandbox', 'workspace', 'docker'], agent: 'Code Sandbox', path: '/sandbox' },
  { keywords: ['generate', 'report', 'document', 'ppt', 'presentation', 'docx', 'pdf', 'latex', 'csv'], agent: 'Generator AI', path: '/generator' },
]

function detectAgent(message) {
  const lower = message.toLowerCase()
  for (const route of AGENT_ROUTES) {
    for (const kw of route.keywords) {
      if (lower.includes(kw)) {
        return route
      }
    }
  }
  return null
}

export default function ClientWorkbench() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // State for right-panel Orchestrator thinking trace
  const [thinkingSteps, setThinkingSteps] = useState([])
  
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMsg = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    const currentInput = input
    setInput('')
    setIsProcessing(true)
    
    // Reset thinking trace
    setThinkingSteps([
      { id: 1, text: 'Parsing user intent...', status: 'loading' }
    ])

    // Simulate Orchestrator step-by-step thinking
    await new Promise(r => setTimeout(r, 800))
    setThinkingSteps(prev => [
      { id: 1, text: 'Parsing user intent...', status: 'done' },
      { id: 2, text: 'Extracting keywords and routing logic...', status: 'loading' }
    ])

    const detected = detectAgent(currentInput)
    await new Promise(r => setTimeout(r, 800))

    if (detected) {
      setThinkingSteps(prev => [
        ...prev.slice(0, 1),
        { id: 2, text: 'Extracting keywords and routing logic...', status: 'done' },
        { id: 3, text: `Routing decision: Redirect to ${detected.agent}`, status: 'done' }
      ])
      
      const routeMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `This looks like a task for the **${detected.agent}**. I can handle general chat here, but for this specialized task you'll get better results from the dedicated agent.`,
        agentRoute: detected,
      }
      setMessages(prev => [...prev, routeMsg])
      setIsProcessing(false)
      return
    }

    setThinkingSteps(prev => [
      ...prev.slice(0, 1),
      { id: 2, text: 'No specialized agent needed. General chat.', status: 'done' },
      { id: 3, text: 'Sending to backend Supervisor agent...', status: 'loading' }
    ])

    try {
      const res = await apiClient.sendMessage(currentInput)
      
      setThinkingSteps(res.thinking_trace?.map((step, idx) => ({
        id: idx + 1,
        text: step,
        status: 'done'
      })) || [{id: 1, text: 'Done', status: 'done'}])

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.reply || 'No response from backend',
        citations: res.citations || [],
        sandbox_result: res.sandbox_result,
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'error', content: `Failed to process request: ${err.message}` }])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-screen bg-surface-100 text-slate-100 overflow-hidden font-sans">
      <ClientSidebar />

      {/* Center: Chat Area */}
      <div className="flex-1 flex flex-col relative bg-surface-100 border-x border-surface-300/50">
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center -mt-20">
              <AgentExploreGrid />
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto pb-4 w-full">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-full max-w-[90%] space-y-3">
                      <div className="bg-surface-200/50 text-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm border border-surface-300 shadow-sm whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      
                      {/* Local Execution Proof Badge */}
                      <div className="flex items-center gap-2 mt-1 opacity-70">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          100% Local Execution (Zero External APIs)
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <BrainCircuit className="w-3 h-3" />
                          Processed by On-Premise Model
                        </span>
                      </div>

                      {msg.agentRoute && (
                        <button
                          onClick={() => navigate(msg.agentRoute.path)}
                          className="flex items-center gap-3 px-5 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-colors w-full text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">→</div>
                          <div>
                            <p className="text-sm font-medium text-purple-300">Go to {msg.agentRoute.agent}</p>
                            <p className="text-xs text-slate-400">Click to navigate to the specialized interface</p>
                          </div>
                        </button>
                      )}
                    </div>
                  )}

                  {msg.role === 'user' && (
                    <div className="bg-sovereign-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md max-w-[85%] break-words">
                      {msg.content}
                    </div>
                  )}
                  {msg.role === 'error' && (
                    <div className="bg-danger/20 text-danger border border-danger/30 px-5 py-3 rounded-2xl rounded-tl-sm">
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-100 flex justify-center border-t border-surface-300/50">
          <div className="w-full max-w-4xl relative bg-surface-200 rounded-3xl border border-surface-300 focus-within:border-slate-500 transition-colors shadow-sm">
            <form onSubmit={handleSend} className="flex flex-col">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask the Orchestrator anything..."
                className="w-full bg-transparent text-slate-200 placeholder-slate-500 py-4 px-5 min-h-[56px] max-h-[200px] resize-y focus:outline-none text-sm"
                rows={1}
              />
              
              <div className="flex items-center justify-between px-3 pb-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-300 rounded-full transition-colors">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-500/30">
                      <span className="text-lg leading-none">+</span>
                    </div>
                  </button>
                  <button type="button" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-300 rounded-full transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-300 rounded-full transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isProcessing}
                    className="rounded-full px-4 py-1.5 bg-surface-300 text-slate-300 hover:bg-surface-400 hover:text-slate-100 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right: Orchestrator Thinking Panel */}
      <div className="w-[300px] bg-[#1a1a1a] border-l border-surface-300 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-surface-300 flex items-center gap-2 bg-surface-200/30">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-medium text-slate-200">Orchestrator Mind</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {thinkingSteps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 opacity-50">
              <Activity className="w-8 h-8" />
              <p className="text-xs text-center">Waiting for input...</p>
            </div>
          ) : (
            thinkingSteps.map((step, idx) => (
              <div key={step.id} className="flex gap-3 animate-fade-in relative">
                {idx !== thinkingSteps.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-[-16px] w-[2px] bg-surface-300" />
                )}
                <div className="shrink-0 relative z-10 bg-[#1a1a1a] mt-0.5">
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
                  )}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`text-xs ${step.status === 'done' ? 'text-slate-300' : 'text-purple-300 animate-pulse'}`}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
