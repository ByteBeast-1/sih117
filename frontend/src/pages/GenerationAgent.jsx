import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Send, FileOutput, Plus, FileText, FileSpreadsheet, Presentation, 
  FileCode2, FileDown, CheckCircle2, Copy, Check, Eye, Printer, Sparkles 
} from 'lucide-react'
import ClientSidebar from '../components/layout/ClientSidebar'
import { apiClient } from '../services/api'

const GENERATOR_TYPES = [
  { id: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-red-400', ext: '.pdf' },
  { id: 'latex', label: 'LaTeX Document', icon: FileCode2, color: 'text-blue-400', ext: '.tex' },
  { id: 'ppt', label: 'PowerPoint (PPTX)', icon: Presentation, color: 'text-orange-400', ext: '.pptx' },
  { id: 'excel', label: 'Excel Worksheet', icon: FileSpreadsheet, color: 'text-emerald-400', ext: '.xlsx' },
]

export default function GenerationAgent() {
  const location = useLocation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Format selection state
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [selectedType, setSelectedType] = useState(GENERATOR_TYPES[0]) // default to PDF

  // Right-side Preview Panel state
  const [previewDoc, setPreviewDoc] = useState(null)
  const [previewTab, setPreviewTab] = useState('doc') // 'doc' or 'source'
  const [copied, setCopied] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle incoming forwarded analysis from Analyser Agent
  useEffect(() => {
    if (location.state?.reportText) {
      const { reportText, sourceFiles } = location.state
      const sourceName = sourceFiles || 'Analyzed Documents'
      
      const welcomeUserMsg = {
        id: Date.now(),
        role: 'user',
        content: `Compile formal engineering report for: ${sourceName}`,
        format: GENERATOR_TYPES[0]
      }
      const welcomeBotMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `📋 **Analysis Received from Analyser Agent**\n\nI have imported the technical inspection results for **${sourceName}**. The complete document structure is loaded into the **Live Preview** panel on the right.\n\nChoose an export format (PDF, LaTeX, PPTX, or Excel) and click **Generate** to compile your final deliverable.`,
        generatedFiles: []
      }
      setMessages([welcomeUserMsg, welcomeBotMsg])
      setInput(`Generate formal report for: ${sourceName}`)
      
      setPreviewDoc({
        title: `Technical Report - ${sourceName}`,
        type: 'pdf',
        typeLabel: 'PDF Document',
        content: reportText,
        filename: `MRPL_Report_${Date.now().toString().slice(-4)}.pdf`,
        downloadUrl: null,
        sizeKb: Math.max(8, Math.round(reportText.length / 80)),
        status: 'Imported from Analyser Agent'
      })
    }
  }, [location.state])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isProcessing) return

    const formatToUse = selectedType || GENERATOR_TYPES[0]
    const userMsg = { id: Date.now(), role: 'user', content: input, format: formatToUse }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsProcessing(true)

    try {
      // Prefix with [Generate Type] so the backend generator prompt context is set
      const res = await apiClient.sendMessage(`[Generate ${formatToUse.label}] ${userMsg.content}`)
      
      const file = (res.generated_files && res.generated_files.length > 0) ? res.generated_files[0] : null
      let downloadSection = ''
      if (file) {
        const downloadUrl = `http://localhost:8000${file.download_url}`
        downloadSection = `\n\n📥 **[Click here to download ${file.filename}](${downloadUrl})**`
      }

      const docContent = res.document_content || res.reply

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.reply + downloadSection,
        generatedFiles: res.generated_files || [],
      }
      setMessages(prev => [...prev, assistantMsg])

      // Update right-side Live Preview
      setPreviewDoc({
        title: userMsg.content.slice(0, 45) || 'Generated Deliverable',
        type: formatToUse.id,
        typeLabel: formatToUse.label,
        content: docContent,
        filename: file ? file.filename : `MRPL_Doc_${Date.now().toString().slice(-4)}${formatToUse.ext}`,
        downloadUrl: file ? `http://localhost:8000${file.download_url}` : null,
        sizeKb: file ? file.size_kb : Math.max(6, Math.round(docContent.length / 90)),
        status: 'Compiled 100% On-Premise'
      })

    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'error', content: `Generation service error: ${err.message}` }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    if (!previewDoc?.content) return
    navigator.clipboard.writeText(previewDoc.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen bg-surface-100 text-slate-100 overflow-hidden font-sans">
      <ClientSidebar />

      {/* Center Left: Chat & Generation Workspace */}
      <div className="flex-1 flex flex-col relative bg-surface-100 border-r border-surface-300/50 min-w-[420px]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-300/50 flex justify-between items-center bg-surface-200/30">
          <div>
            <h1 className="text-lg font-medium text-slate-200">Generator AI</h1>
            <p className="text-xs text-slate-500">Produce formal reports in PDF, LaTeX, PPTX, or Excel with live side preview.</p>
          </div>
          {previewDoc && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live Preview Active
            </span>
          )}
        </div>

        {/* Chat / Generation Logs */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <FileOutput className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-medium text-slate-200 mb-1">Document Generation Engine</h2>
              <p className="text-xs text-slate-400 max-w-md mb-6">
                Choose an output format below (PDF, LaTeX, PowerPoint, or Excel), enter your topic or import directly from the Analyser Agent.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {GENERATOR_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedType?.id === type.id 
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-sm'
                        : 'border-surface-300 bg-surface-200/40 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <type.icon className={`w-3.5 h-3.5 ${type.color}`} />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 max-w-2xl mx-auto pb-4 w-full">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex flex-col gap-2 w-full max-w-[92%]">
                      <div className="bg-surface-200/60 text-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm border border-surface-300 shadow-sm whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content}
                      </div>

                      {/* Download Buttons */}
                      {msg.generatedFiles && msg.generatedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {msg.generatedFiles.map((file, idx) => (
                            <a
                              key={idx}
                              href={`http://localhost:8000${file.download_url}`}
                              download
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              Download {file.filename} ({file.size_kb} KB)
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="flex flex-col items-end gap-1 w-full max-w-[85%]">
                      {msg.format && (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-300 text-[10px] font-medium text-slate-300">
                          <msg.format.icon className={`w-3 h-3 ${msg.format.color}`} />
                          Target: {msg.format.label}
                        </div>
                      )}
                      <div className="bg-sovereign-600 text-white px-5 py-2.5 rounded-2xl rounded-tr-sm shadow-md text-sm break-words">
                        {msg.content}
                      </div>
                    </div>
                  )}
                  {msg.role === 'error' && (
                    <div className="bg-danger/20 text-danger border border-danger/30 px-4 py-2.5 rounded-xl text-xs">{msg.content}</div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-surface-100 flex justify-center border-t border-surface-300/50 relative">
          
          {/* Format Picker Popover */}
          {showTypeMenu && (
            <div className="absolute bottom-[75px] left-8 bg-surface-200 border border-surface-300 rounded-xl shadow-2xl p-3 w-[300px] z-50 animate-fade-in">
              <div className="text-[11px] font-semibold text-slate-400 mb-2 px-1 uppercase tracking-wider">Select Output Format</div>
              <div className="grid grid-cols-2 gap-2">
                {GENERATOR_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type)
                      setShowTypeMenu(false)
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
                      selectedType?.id === type.id 
                        ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                        : 'bg-surface-100/50 border-surface-300 hover:bg-surface-300/50 text-slate-300'
                    }`}
                  >
                    <type.icon className={`w-4 h-4 ${type.color}`} />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="w-full max-w-2xl relative">
            {selectedType && (
              <div className="absolute -top-7 left-2 flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded-t-md text-[11px] text-indigo-300">
                <selectedType.icon className={`w-3 h-3 ${selectedType.color}`} />
                Target: <strong>{selectedType.label}</strong>
              </div>
            )}
            
            <div className={`bg-surface-200 border transition-colors shadow-sm rounded-2xl ${selectedType ? 'rounded-tl-none border-indigo-500/30' : 'border-surface-300 focus-within:border-slate-500'}`}>
              <form onSubmit={handleSend} className="flex flex-col">
                <textarea 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={`Describe what to generate in ${selectedType?.label || 'selected format'}...`}
                  className="w-full bg-transparent text-slate-200 placeholder-slate-500 py-3 px-4 min-h-[48px] max-h-[100px] resize-y focus:outline-none text-xs leading-relaxed" 
                  rows={1} 
                />
                <div className="flex items-center justify-between px-3 pb-2 pt-1 border-t border-surface-300/40">
                  <button 
                    type="button" 
                    onClick={() => setShowTypeMenu(!showTypeMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-full transition-colors text-[11px] font-medium"
                  >
                    <Plus className="w-3 h-3" /> Change Format
                  </button>
                  <button 
                    type="submit" 
                    disabled={!input.trim() || isProcessing} 
                    className="rounded-full px-4 py-1 bg-sovereign-600 hover:bg-sovereign-500 text-white disabled:opacity-50 transition-colors flex items-center gap-1.5 text-xs font-medium"
                  >
                    {isProcessing ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Generate
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: LIVE DOCUMENT PREVIEW & EXPORT */}
      <div className="w-[460px] bg-[#121214] border-l border-surface-300/50 flex flex-col shrink-0">
        
        {/* Preview Header */}
        <div className="px-5 py-4 border-b border-surface-300/50 flex justify-between items-center bg-surface-200/40">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-200">Document Live Preview</h2>
          </div>
          {previewDoc && (
            <div className="flex items-center gap-1.5 bg-surface-300/60 p-0.5 rounded-lg border border-surface-400/40">
              <button
                onClick={() => setPreviewTab('doc')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${previewTab === 'doc' ? 'bg-surface-100 text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Rendered
              </button>
              <button
                onClick={() => setPreviewTab('source')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${previewTab === 'source' ? 'bg-surface-100 text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Source / Code
              </button>
            </div>
          )}
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-[#0d0d0f]">
          {!previewDoc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <FileOutput className="w-10 h-10 opacity-30 mb-3 text-slate-400" />
              <p className="text-xs font-medium text-slate-400 mb-1">Awaiting Document Content</p>
              <p className="text-[11px] max-w-xs leading-relaxed opacity-70">
                Generate a PDF, LaTeX, PowerPoint, or Excel document, or transfer findings from the Analyser Agent to view live rendered pages here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Document Meta Header Bar */}
              <div className="p-3 bg-surface-200/70 border border-surface-300/60 rounded-xl flex items-center justify-between">
                <div className="truncate pr-2">
                  <div className="text-xs font-semibold text-slate-200 truncate">{previewDoc.filename}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="uppercase text-amber-400 font-bold">{previewDoc.type}</span>
                    <span>•</span>
                    <span>{previewDoc.sizeKb} KB</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">100% Local</span>
                  </div>
                </div>
                {previewDoc.downloadUrl ? (
                  <a
                    href={previewDoc.downloadUrl}
                    download
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Download
                  </a>
                ) : (
                  <button
                    onClick={handleSend}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sovereign-600 hover:bg-sovereign-500 text-white text-xs font-medium shadow"
                  >
                    Compile {previewDoc.type.toUpperCase()}
                  </button>
                )}
              </div>

              {/* Rendered Document Sheet Simulation */}
              {previewTab === 'doc' ? (
                <div className="bg-slate-50 text-slate-900 rounded-lg p-6 shadow-2xl border border-slate-200 text-xs font-sans leading-relaxed select-text min-h-[420px]">
                  {/* Formal Letterhead */}
                  <div className="border-b-2 border-slate-800 pb-3 mb-4 text-center">
                    <div className="text-[14px] font-black uppercase tracking-wider text-slate-900">MANGALORE REFINERY AND PETROCHEMICALS LIMITED</div>
                    <div className="text-[9px] text-slate-600 uppercase font-semibold tracking-widest mt-0.5">Sovereign Technical Intelligence & Documentation</div>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 mt-2 pt-1 border-t border-slate-200">
                      <span>Doc Ref: MRPL-ENG-{(previewDoc.filename.match(/\d+/) || [Date.now()])[0]}</span>
                      <span>Date: {new Date().toLocaleDateString()}</span>
                      <span className="font-bold text-red-600">CONFIDENTIAL / INTERNAL</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3 whitespace-pre-wrap text-slate-800">
                    {previewDoc.content}
                  </div>

                  {/* Document Footer */}
                  <div className="border-t border-slate-300 mt-8 pt-2 flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>Generated by MRPL Sovereign AI</span>
                    <span>Zero External API Calls • Verified</span>
                  </div>
                </div>
              ) : (
                /* Source / Code View (LaTeX / Raw Content) */
                <div className="relative bg-[#18181b] border border-surface-300 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[500px]">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-surface-300/40 text-[10px] text-slate-400 uppercase tracking-wider">
                    <span>Source Payload ({previewDoc.type.toUpperCase()})</span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy Source'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {previewDoc.content}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        {previewDoc && (
          <div className="p-3 border-t border-surface-300/50 bg-surface-200/40 flex justify-between items-center">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-300 bg-surface-100 hover:bg-surface-300/50 text-slate-300 text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            {previewDoc.downloadUrl && (
              <a
                href={previewDoc.downloadUrl}
                download
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow"
              >
                <FileDown className="w-3.5 h-3.5" />
                Download {previewDoc.type.toUpperCase()}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
