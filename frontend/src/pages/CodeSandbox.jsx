import { useState, useRef, useEffect } from 'react'
import { Send, Play, Box, FileCode, CheckCircle2, TerminalSquare, AlertTriangle, Copy } from 'lucide-react'
import ClientSidebar from '../components/layout/ClientSidebar'
import { apiClient } from '../services/api'

export default function CodeSandbox() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: "Welcome to the Sandbox. I am the Code Architect. Ready. You can upload specs or describe the logic you want to build. If execution is too complex, I will shift it to the isolated Docker sandbox." }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [code, setCode] = useState("def calculate_yield(pressure, temp):\n    # Write your solution here...\n    return (pressure * 0.8) + (temp * 0.2)\n\nprint('Hello MRPL Sandbox')")
  const [output, setOutput] = useState('')
  const [isSandboxRunning, setIsSandboxRunning] = useState(false)

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
      const res = await apiClient.sendMessage(`[Code Sandbox] ${userMsg.content}`)
      
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.reply || 'Code generated.',
      }
      setMessages(prev => [...prev, assistantMsg])
      
      // If code was generated in the reply, try to extract it
      const codeMatch = res.reply?.match(/```python\n([\s\S]*?)```/)
      if (codeMatch && codeMatch[1]) {
        setCode(codeMatch[1])
      }
      
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'error', content: `Sandbox connection failed: ${err.message}` }])
    } finally {
      setIsProcessing(false)
    }
  }

  const runCode = async () => {
    setIsSandboxRunning(true)
    setOutput('Initiating secure execution container...\n')
    
    try {
      const res = await apiClient.executeCode(code)
      const enginePrefix = res.engine ? `[${res.engine}]\n` : ''
      if (res.success) {
        setOutput(`${enginePrefix}Execution completed successfully.\n---\n${res.stdout}`)
      } else {
        setOutput(`${enginePrefix}Execution failed (Exit Code ${res.exit_code}).\n---\n${res.stderr || res.stdout}`)
      }
    } catch (err) {
      setOutput(`Error connecting to sandbox: ${err.message}`)
    } finally {
      setIsSandboxRunning(false)
    }
  }

  return (
    <div className="flex h-screen bg-surface-100 text-slate-100 overflow-hidden font-sans">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col relative bg-[#131314]">
        
        {/* Top Header */}
        <div className="h-14 border-b border-surface-300 flex items-center justify-between px-4 bg-[#1e1e1e]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <FileCode className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium">main.py</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-surface-300 text-slate-400 ml-2">Python 3.12</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] flex items-center gap-1.5 text-slate-400 px-3 border-r border-surface-300">
              <Box className="w-3.5 h-3.5 text-emerald-400" />
              Docker Linked
            </div>
            <button 
              onClick={runCode}
              disabled={isSandboxRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#131314] text-xs font-bold rounded shadow-sm transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              RUN SANDBOX
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Chat (The Architect) */}
          <div className="w-[380px] border-r border-surface-300 flex flex-col bg-[#161618]">
            <div className="h-12 border-b border-surface-300 flex items-center justify-between px-4">
              <h2 className="text-sm font-medium text-slate-200">The Architect</h2>
              <span className="text-[10px] px-2 py-0.5 bg-surface-300 rounded text-slate-400">AI</span>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="bg-surface-200/50 text-slate-300 px-4 py-3 rounded-lg border border-surface-300 text-sm w-[90%]">
                      <div className="text-[10px] font-bold text-teal-400 mb-2 uppercase tracking-wider">AI</div>
                      
                      {/* Render content splitting by code blocks */}
                      {msg.content.split(/(```[\s\S]*?```)/g).map((part, index) => {
                        if (part.startsWith('```') && part.endsWith('```')) {
                          const codeContent = part.replace(/```[a-z]*\n?/i, '').replace(/```$/, '');
                          return (
                            <div key={index} className="relative group my-2 bg-[#1e1e1e] rounded-md border border-surface-300 overflow-hidden">
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => navigator.clipboard.writeText(codeContent.trim())}
                                  className="p-1 bg-surface-200 hover:bg-surface-300 rounded text-slate-400 hover:text-white"
                                  title="Copy code"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                {codeContent.trim()}
                              </pre>
                            </div>
                          )
                        }
                        return <div key={index} className="whitespace-pre-wrap">{part}</div>
                      })}
                      
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="bg-teal-600/20 text-teal-100 border border-teal-500/30 px-4 py-3 rounded-lg text-sm w-[85%] break-words">
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-surface-300 bg-[#1e1e1e]">
              <form onSubmit={handleSend} className="relative flex items-center">
                <textarea 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder="Query..." 
                  className="w-full bg-[#131314] border border-surface-300 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 resize-none h-[42px]" 
                  rows={1}
                />
                <button type="submit" disabled={!input.trim() || isProcessing} className="absolute right-2 p-1.5 text-slate-400 hover:text-teal-400 disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Code & Output Split */}
          <div className="flex-1 flex flex-col">
            
            {/* Top: Code Editor */}
            <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex flex-col">
              <div className="flex text-slate-500 font-mono text-sm leading-relaxed p-4 h-full outline-none">
                <div className="text-right pr-4 select-none opacity-50 flex flex-col">
                  {code.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 bg-transparent text-slate-300 resize-none outline-none overflow-y-auto whitespace-pre"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Bottom: Terminal / Instructions */}
            <div className="h-[280px] border-t border-surface-300 bg-[#161618] flex flex-col">
              <div className="flex items-center px-4 h-10 border-b border-surface-300 bg-[#1e1e1e] gap-6">
                <button className="text-xs font-semibold text-teal-400 border-b-2 border-teal-400 h-full uppercase tracking-wide">Terminal Output</button>
                <button className="text-xs font-semibold text-slate-500 hover:text-slate-300 h-full uppercase tracking-wide">Verification</button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 bg-[#131314]">
                {output ? (
                  <div className="whitespace-pre-wrap">{output}</div>
                ) : (
                  <div className="text-slate-500 flex items-center gap-2">
                    <TerminalSquare className="w-4 h-4" /> Ready. Waiting for execution.
                  </div>
                )}
                {isSandboxRunning && <div className="mt-2 w-2 h-4 bg-teal-400 animate-pulse" />}
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  )
}
