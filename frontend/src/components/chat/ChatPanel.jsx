import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Camera, Paperclip, Zap, ChevronLeft, Bot } from 'lucide-react'
import { apiClient } from '../../services/api'
import ThinkingTrace from './ThinkingTrace'
import CitationCard from './CitationCard'
import AgentProgressDAG from './AgentProgressDAG'
import SafetyLimitBanner from './SafetyLimitBanner'
import EditConfirmationModal from './EditConfirmationModal'
import DeliverableCard from './DeliverableCard'
import ExplanationToggle from '../addons/ExplanationToggle'
import ShiftHandover from '../addons/ShiftHandover'
import AgentExploreGrid from './AgentExploreGrid'

export default function ChatPanel({ activeAgent, onReset }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [explanationMode, setExplanationMode] = useState('engineer')
  
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
      // Pass the activeAgent to the backend (in real app)
      const res = await apiClient.sendMessage(input)
      
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.reply || res.message || '',
        agent: activeAgent,
        thinkingTrace: res.thinking_trace || null,
        citations: res.citations || [],
        ...res
      }
      
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'error', content: 'Agent communication failed.' }])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface-100 border-x border-surface-300/50 relative">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            <AgentExploreGrid onSelectAgent={onReset} activeAgent={activeAgent} />
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Assistant Message Rendering */}
                {msg.role === 'assistant' && (
                  <div className="w-full max-w-[90%] space-y-3">
                    
                    {/* Explanation Toggle */}
                    <div className="mb-2 flex justify-end">
                      <ExplanationToggle mode={explanationMode} onToggle={setExplanationMode} />
                    </div>

                    {/* Progress DAG */}
                    {msg.agentProgress && <AgentProgressDAG steps={msg.agentProgress} />}
                    
                    {/* Thinking Trace */}
                    {msg.thinkingTrace && <ThinkingTrace trace={msg.thinkingTrace} />}

                    {/* Message Bubble */}
                    <div className="bg-surface-200/50 text-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm border border-surface-300 shadow-sm prose prose-invert max-w-none">
                      {msg.content}
                    </div>

                    {/* Safety Banner */}
                    {msg.safetyLimitExceeded && <SafetyLimitBanner details={msg.safetyLimitDetails} />}

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.citations.map((c, i) => <CitationCard key={i} citation={c} />)}
                      </div>
                    )}

                    {/* Deliverables / Code Edits */}
                    {msg.deliverable && <DeliverableCard file={msg.deliverable} />}
                    {msg.codeEdit && <EditConfirmationModal diff={msg.codeEdit} />}
                  </div>
                )}

                {/* User Message Bubble */}
                {msg.role === 'user' && (
                  <div className="bg-sovereign-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md max-w-[85%] break-words">
                    {msg.content}
                  </div>
                )}

                {/* Error Bubble */}
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
      <div className="p-4 bg-surface-100 flex justify-center">
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
              placeholder="Start typing a prompt to see what our models can do"
              className="w-full bg-transparent text-slate-200 placeholder-slate-500 py-4 px-5 min-h-[56px] max-h-[200px] resize-y focus:outline-none text-sm"
              rows={1}
            />
            
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <div className="flex items-center gap-1.5">
                <button type="button" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-300 rounded-full transition-colors" title="Attach Document">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-500/30">
                    <span className="text-lg leading-none">+</span>
                  </div>
                </button>
                <button type="button" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-300 rounded-full transition-colors" title="Snap & Ask">
                  <Camera className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-surface-300/50 rounded-lg text-xs font-medium text-slate-300 border border-surface-400/30 cursor-pointer hover:bg-surface-300 transition-colors">
                  <Paperclip className="w-3 h-3" />
                  Tools
                </div>
                <div className="h-4 w-px bg-surface-400/50 mx-2" />
                <ShiftHandover />
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-300 rounded-full transition-colors" title="Voice Input">
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isProcessing}
                  className="rounded-full px-4 py-1.5 bg-surface-300 text-slate-300 hover:bg-surface-400 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-sm font-medium"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" />
                  ) : (
                    "Run Ctrl ↵"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
