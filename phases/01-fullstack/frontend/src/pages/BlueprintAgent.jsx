import { useState, useRef, useEffect } from 'react'
import { Send, Upload } from 'lucide-react'
import AgentPageLayout from '../components/layout/AgentPageLayout'

/**
 * BlueprintAgent — Vision/P&ID analysis page.
 * Accepts PDF uploads, extracts equipment tags, pressures, and yields.
 */
export default function BlueprintAgent() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const uploadMsg = { id: Date.now(), role: 'user', content: `📎 Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` }
    setMessages(prev => [...prev, uploadMsg])

    // Mock analysis response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `**Vision Agent — P&ID Analysis**\n\nFile: ${file.name}\n\n**Equipment Tags Found:** V-204, P-101A, E-301, TK-102\n**Pressure Readings:** 12 MPa (design), 10.5 MPa (operating)\n**Yield Prediction:** 87.4% (Prototype placeholder model)\n\n📄 Citation: ${file.name} — Page 1\n📄 Cross-ref: Pressure_Safety_SOP_v3.pdf — p.2 — Operating Limits\n\n[Prototype — connect to backend vision_agent.py for real PDF analysis]`,
      }])
    }, 1500)
  }

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMsg = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsProcessing(true)

    try {
      await new Promise(r => setTimeout(r, 1000))
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `[Vision Agent] To analyze a blueprint or P&ID, please upload a PDF file using the upload button. I can also answer text-based questions about equipment specifications.\n\nQuery: "${userMsg.content}"`,
      }])
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'error', content: 'Vision Agent unavailable.' }])
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
              <h1 className="text-[28px] font-normal text-slate-200 mb-2">Vision & Blueprint Agent</h1>
              <p className="text-sm text-slate-500 mb-8">
                Upload P&ID scans and technical schematics. Extracts equipment tags, operating pressures, and yield predictions.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-6 py-4 rounded-xl border border-dashed border-surface-400 bg-surface-200/30 hover:bg-surface-300/50 transition-colors mb-6 w-full justify-center"
              >
                <Upload className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-slate-300">Upload a P&ID or schematic PDF</span>
              </button>
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" onChange={handleFileUpload} className="hidden" />
              <div className="grid grid-cols-2 gap-3">
                {['Analyze valve V-204 specs', 'Equipment tags in CDU-1 diagram', 'Pressure limits for pipeline section A', 'Yield prediction for current layout'].map(s => (
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
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-amber-400 transition-colors">
              <Upload className="w-4 h-4" />
            </button>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Ask about a blueprint or upload a PDF..." className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-sm resize-none min-h-[24px] max-h-[120px]" rows={1} />
            <button type="submit" disabled={!input.trim() || isProcessing} className="p-2 rounded-full bg-surface-300 text-slate-300 hover:bg-surface-400 disabled:opacity-50 transition-colors">
              {isProcessing ? <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </AgentPageLayout>
  )
}
