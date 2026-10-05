import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import AgentPageLayout from '../components/layout/AgentPageLayout'

/**
 * SupervisorWorkspace — multi-agent orchestration page.
 * Breaks complex tasks into sub-agent DAGs and coordinates execution.
 */
export default function SupervisorWorkspace() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMsg = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsProcessing(true)

    try {
      // TODO: Connect to POST /api/v1/agents/supervisor/message
      await new Promise(r => setTimeout(r, 1500))
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `**Supervisor Agent — Task Decomposition**\n\nComplex task: "${userMsg.content}"\n\n**Execution Plan (DAG):**\n\n┌─ Step 1: Vision Agent → Extract equipment tags from uploaded P&ID\n├─ Step 2: Knowledge Agent → Retrieve SOP for identified equipment\n├─ Step 3: Math Agent → Calculate operating limits\n└─ Step 4: Generation Agent → Compile final report (.docx)\n\n**Status:** All sub-agents queued\n**Estimated time:** ~45 seconds\n\n[Prototype — connect to backend supervisor_graph.py for real LangGraph orchestration]`,
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'error', content: 'Supervisor Agent unavailable.' }])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AgentPageLayout>
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            <div className="w-full max-w-2xl px-4">
              <h1 className="text-[28px] font-normal text-slate-200 mb-2">Supervisor Agent</h1>
              <p className="text-sm text-slate-500 mb-8">
                Multi-agent orchestration. Breaks complex tasks into sub-agent DAGs and coordinates execution automatically.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Analyze P&ID and calculate pressure drop for V-102', 'Generate Q3 safety report from all SOPs', 'Full equipment inspection + compliance check', 'Cross-reference blueprint with maintenance logs'].map(s => (
                  <button key={s} onClick={() => setInput(s)} className="text-left p-3 rounded-xl border border-surface-300 bg-surface-200/40 hover:bg-surface-300/50 text-xs text-slate-400">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto pb-4 w-full">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="bg-surface-200/50 text-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm border border-surface-300 shadow-sm whitespace-pre-wrap w-full max-w-[90%]">
                    {msg.content}
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="bg-sovereign-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md max-w-[85%] break-words">{msg.content}</div>
                )}
                {msg.role === 'error' && (
                  <div className="bg-danger/20 text-danger border border-danger/30 px-5 py-3 rounded-2xl rounded-tl-sm">{msg.content}</div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-surface-100 flex justify-center">
        <div className="w-full max-w-4xl relative bg-surface-200 rounded-3xl border border-surface-300 focus-within:border-slate-500 transition-colors shadow-sm">
          <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3">
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Describe a complex multi-agent task..." className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-sm resize-none min-h-[24px] max-h-[120px]" rows={1} />
            <button type="submit" disabled={!input.trim() || isProcessing} className="p-2 rounded-full bg-surface-300 text-slate-300 hover:bg-surface-400 disabled:opacity-50 transition-colors">
              {isProcessing ? <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </AgentPageLayout>
  )
}
