import { useState, useRef, useEffect } from 'react'
import { Send, FileOutput, Plus, FileText, FileSpreadsheet, Presentation, FileCode2, FileDown } from 'lucide-react'
import ClientSidebar from '../components/layout/ClientSidebar'

const GENERATOR_TYPES = [
  { id: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-red-400', ext: '.pdf' },
  { id: 'ppt', label: 'PowerPoint (PPTX)', icon: Presentation, color: 'text-orange-400', ext: '.pptx' },
  { id: 'excel', label: 'Excel Worksheet', icon: FileSpreadsheet, color: 'text-emerald-400', ext: '.xlsx' },
  { id: 'csv', label: 'CSV Data', icon: FileSpreadsheet, color: 'text-emerald-300', ext: '.csv' },
  { id: 'latex', label: 'LaTeX / MD', icon: FileCode2, color: 'text-blue-400', ext: '.tex' },
  { id: 'template', label: 'Custom Template', icon: FileDown, color: 'text-indigo-400', ext: '.docx' },
]

export default function GenerationAgent() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Format selection state
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [selectedType, setSelectedType] = useState(null)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isProcessing) return

    if (!selectedType) {
      alert("Please select a file format to generate first (Click the + button).")
      return
    }

    const userMsg = { id: Date.now(), role: 'user', content: input, format: selectedType }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsProcessing(true)

    try {
      await new Promise(r => setTimeout(r, 1500))
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `**Generation Complete**\n\nI have generated the ${selectedType.label} based on your description.\n\n📄 **Generated_File${selectedType.ext}**\n\nThis file has been automatically saved to your Artifacts panel in the sidebar for download.`,
      }
      setMessages(prev => [...prev, assistantMsg])
      setSelectedType(null) // reset after generation
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'error', content: 'Generation service unavailable.' }])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-screen bg-surface-100 text-slate-100 overflow-hidden font-sans">
      <ClientSidebar />
      <div className="flex-1 flex flex-col relative bg-surface-100 border-x border-surface-300/50">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-300/50 flex justify-between items-center bg-surface-200/30">
          <div>
            <h1 className="text-lg font-medium text-slate-200">Generator AI</h1>
            <p className="text-xs text-slate-500">Select a format and describe what you need to generate.</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-2xl px-4 flex flex-col items-center text-center">
                <FileOutput className="w-12 h-12 text-indigo-400 mb-4" />
                <h2 className="text-2xl font-normal text-slate-200 mb-2">Ready to Generate</h2>
                <p className="text-sm text-slate-500 mb-8 max-w-md">
                  Click the <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-md mx-1">+</span> button below to choose your output format (PDF, PPT, Excel, etc.), then describe the content.
                </p>
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
                    <div className="flex flex-col items-end gap-1 w-full max-w-[85%]">
                      {msg.format && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-300 text-[10px] font-medium text-slate-300">
                          <msg.format.icon className={`w-3 h-3 ${msg.format.color}`} />
                          Target: {msg.format.label}
                        </div>
                      )}
                      <div className="bg-sovereign-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md break-words">
                        {msg.content}
                      </div>
                    </div>
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

        {/* Input Area with Format Selector */}
        <div className="p-4 bg-surface-100 flex justify-center border-t border-surface-300/50 relative">
          
          {/* Format Picker Popover */}
          {showTypeMenu && (
            <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-surface-200 border border-surface-300 rounded-xl shadow-2xl p-4 w-[360px] z-50 animate-fade-in">
              <div className="text-xs font-semibold text-slate-400 mb-3 px-1 uppercase tracking-wider">Select Output Format</div>
              <div className="grid grid-cols-2 gap-2">
                {GENERATOR_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type)
                      setShowTypeMenu(false)
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-surface-300 bg-surface-100/50 hover:bg-surface-300/50 hover:border-indigo-500/30 transition-all text-left"
                  >
                    <div className="p-1.5 rounded-md bg-surface-200">
                      <type.icon className={`w-4 h-4 ${type.color}`} />
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="w-full max-w-4xl relative">
            {/* Selected Format Badge */}
            {selectedType && (
              <div className="absolute -top-10 left-2 flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-t-lg rounded-b-none text-xs text-indigo-300">
                <selectedType.icon className="w-3.5 h-3.5" />
                Generating: <strong>{selectedType.label}</strong>
                <button onClick={() => setSelectedType(null)} className="ml-2 hover:text-white">&times;</button>
              </div>
            )}
            
            <div className={`bg-surface-200 border transition-colors shadow-sm ${selectedType ? 'rounded-3xl rounded-tl-none border-indigo-500/30' : 'rounded-3xl border-surface-300 focus-within:border-slate-500'}`}>
              <form onSubmit={handleSend} className="flex flex-col">
                <textarea 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={selectedType ? `Describe the ${selectedType.label} you want to generate...` : "Choose a format first to start generating..."} 
                  className="w-full bg-transparent text-slate-200 placeholder-slate-500 py-4 px-5 min-h-[56px] max-h-[120px] resize-y focus:outline-none text-sm" 
                  rows={1} 
                />
                <div className="flex items-center justify-between px-3 pb-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowTypeMenu(!showTypeMenu)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-full transition-colors text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" /> Choose & Generate
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    disabled={(!input.trim() && !isProcessing) || !selectedType} 
                    className="rounded-full px-4 py-1.5 bg-surface-300 text-slate-300 hover:bg-surface-400 hover:text-slate-100 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {isProcessing ? <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Click outside to close menu */}
        {showTypeMenu && (
          <div className="absolute inset-0 z-40 bg-black/0" onClick={() => setShowTypeMenu(false)} />
        )}
      </div>
    </div>
  )
}
