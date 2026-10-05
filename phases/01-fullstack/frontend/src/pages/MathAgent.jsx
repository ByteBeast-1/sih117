import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import AgentPageLayout from '../components/layout/AgentPageLayout'

/**
 * MathAgent — step-by-step engineering calculations.
 * Shows every intermediate step so engineers can verify the computation.
 * References relevant standards (ASME, API, IS) where applicable.
 */
export default function MathAgent() {
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
      // TODO: Connect to POST /api/v1/agents/math/calculate
      await new Promise(r => setTimeout(r, 1200))
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `**Math Agent — Step-by-Step Solution**\n\nQuery: "${userMsg.content}"\n\n**Step 1:** Identify the relevant formula\n→ Using Bernoulli's equation for pressure drop calculation\n\n**Step 2:** Substitute known values\n→ P₁ = 12 MPa, D = 500mm, ρ = 850 kg/m³\n\n**Step 3:** Calculate result\n→ ΔP = 0.45 MPa\n\n**Reference:** API 610 — Centrifugal Pumps for Petroleum Industry\n\n[Prototype — connect to backend for real calculations via qwen2.5:1.5b]`,
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'error', content: 'Math Agent unavailable.' }])
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
              <h1 className="text-[28px] font-normal text-slate-200 mb-2">Math & Calculation Agent</h1>
              <p className="text-sm text-slate-500 mb-8">
                Step-by-step engineering calculations with verifiable derivations and standard references.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Pressure drop across 4-inch pipe', 'Heat exchanger duty calculation', 'Pump head requirement for CDU-1', 'Stress analysis for 500mm pipe'].map(s => (
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
              placeholder="Describe the calculation you need..." className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-sm resize-none min-h-[24px] max-h-[120px]" rows={1} />
            <button type="submit" disabled={!input.trim() || isProcessing} className="p-2 rounded-full bg-surface-300 text-slate-300 hover:bg-surface-400 disabled:opacity-50 transition-colors">
              {isProcessing ? <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </AgentPageLayout>
  )
}
