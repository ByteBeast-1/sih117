import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../App'
import {
  Menu, History, Settings, Library, LogOut, ChevronDown,
  MessageSquareCode, FileSearch, Code2, FileOutput, FolderArchive,
  FileText, ShieldCheck, Network, ExternalLink, Trash2
} from 'lucide-react'
import { apiClient } from '../../services/api'

const AGENTS = [
  { id: 'orchestrator', path: '/',            label: 'General Chat',       icon: MessageSquareCode, color: 'text-purple-400' },
  { id: 'analyzer',     path: '/analyzer',    label: 'Analyser Agent',     icon: FileSearch,        color: 'text-amber-400' },
  { id: 'generator',    path: '/generator',   label: 'Generator AI',       icon: FileOutput,        color: 'text-indigo-400' },
  { id: 'sandbox',      path: '/sandbox',     label: 'Code Sandbox',       icon: Code2,             color: 'text-teal-400' },
  { id: 'artifacts',    path: '/artifacts',   label: 'Artifacts Library',  icon: FolderArchive,     color: 'text-blue-400' },
]

export default function ClientSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [conversations, setConversations] = useState([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const loadHistory = async () => {
    try {
      const res = await apiClient.getConversations()
      if (res && res.conversations) {
        setConversations(res.conversations)
      }
    } catch (err) {
      console.warn('Could not load chat history:', err)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [location.pathname])

  const handleDeleteConvo = async (id, e) => {
    e.stopPropagation()
    try {
      await apiClient.deleteConversation(id)
      setConversations(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }

  return (
    <div className="h-full w-[260px] bg-[#131314] border-r border-surface-300 flex flex-col z-20 overflow-y-auto shrink-0 select-none">
      
      {/* Brand & Menu */}
      <div className="flex items-center gap-3 px-4 h-14 mt-2">
        <button className="p-2 text-slate-300 hover:bg-surface-200 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-semibold text-slate-100 text-base tracking-wide flex items-center gap-2">
          <span>MRPL Sovereign</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            AIR-GAP
          </span>
        </div>
      </div>

      <div className="flex-1 px-3 py-4 flex flex-col gap-6">
        
        {/* WORKSPACE AGENTS Section */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Workspace Hub
          </div>
          <div className="space-y-1">
            {AGENTS.map((agent) => {
              const isActive = location.pathname === agent.path
              const Icon = agent.icon
              return (
                <button
                  key={agent.id}
                  onClick={() => navigate(agent.path)}
                  className={`w-full flex items-center px-3 py-2 gap-3 rounded-xl transition-all duration-150 text-xs ${
                    isActive
                      ? 'bg-surface-200 text-slate-100 font-semibold shadow-sm border border-surface-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? agent.color : 'text-slate-400'}`} />
                  <span className="truncate">{agent.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* PERSISTENT DATABASE CHAT HISTORY Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-3 mb-1">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 hover:text-slate-300 transition-colors"
            >
              <History className="w-3 h-3" />
              <span>Session History</span>
            </button>
            <span className="text-[9px] font-mono text-slate-500">{conversations.length}</span>
          </div>

          {isHistoryOpen && (
            <div className="space-y-0.5 mt-1 max-h-[190px] overflow-y-auto pr-1">
              {conversations.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-slate-500 italic">
                  No sessions recorded yet.
                </div>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (c.agent === 'analyzer') navigate('/analyzer')
                      else if (c.agent === 'generator') navigate('/generator')
                      else if (c.agent === 'sandbox') navigate('/sandbox')
                      else navigate(`/?convo=${c.id}`)
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-100 hover:bg-surface-200/60 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-indigo-400 shrink-0 transition-colors" />
                      <span className="truncate max-w-[170px]" title={c.title}>
                        {c.title}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConvo(c.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 rounded transition-opacity shrink-0"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* MANAGEMENT & AUDIT Section */}
        <div className="mt-auto pt-4 border-t border-surface-300/40">
          <div className="space-y-1">
            <button 
              onClick={() => setShowProofModal(true)} 
              className="w-full flex items-center px-3 py-2 gap-3 text-slate-400 hover:text-slate-200 hover:bg-surface-200/60 rounded-xl transition-colors text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Architecture & Security Proof</span>
            </button>
            
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')} 
                className="w-full flex items-center px-3 py-2 gap-3 text-slate-400 hover:text-slate-200 hover:bg-surface-200/60 rounded-xl transition-colors text-xs"
              >
                <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Admin Diagnostics</span>
              </button>
            )}
            
            <div className="group rounded-xl transition-all duration-200 hover:bg-surface-200/40">
              <div className="flex items-center px-3 py-2 gap-3 text-slate-400 text-xs">
                <Library className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Refinery SOP Library</span>
              </div>
              <div className="py-1 space-y-1 pl-8 pr-2">
                <a 
                  href="/docs/MRPL_C301_Distillation_Column_Specs.txt" 
                  download="MRPL_C301_Specs.txt" 
                  className="flex items-center gap-1.5 py-1 text-[11px] text-slate-400 hover:text-indigo-400 truncate transition-colors"
                >
                  <FileText className="w-3 h-3 shrink-0 text-slate-500" />
                  <span className="truncate">C301_Column_Specs.txt</span>
                </a>
                <a 
                  href="/docs/MRPL_Maintenance_Log_August.txt" 
                  download="MRPL_Maintenance_Log.txt" 
                  className="flex items-center gap-1.5 py-1 text-[11px] text-slate-400 hover:text-indigo-400 truncate transition-colors"
                >
                  <FileText className="w-3 h-3 shrink-0 text-slate-500" />
                  <span className="truncate">Maintenance_Log_Aug.txt</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User Area */}
      <div className="p-3 border-t border-surface-300 relative shrink-0 bg-[#161618]">
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-surface-200 transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'E'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{user?.username || 'eng_rajesh'}</div>
            <div className="text-[10px] text-slate-500 uppercase font-mono">{user?.role || 'Engineer'}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            <div className="absolute bottom-full left-3 mb-2 w-52 bg-[#1c1c1e] border border-surface-300 rounded-xl shadow-xl z-50 p-1.5 animate-fade-in">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      {/* System Architecture & Security Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1a1a1c] border border-surface-300 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-surface-300 bg-surface-200/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">System Architecture & Offline Security Proof</h2>
              </div>
              <button onClick={() => setShowProofModal(false)} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-300 space-y-5">
              
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                <h3 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Network className="w-4 h-4"/> 100% On-Premise Execution
                </h3>
                <p className="mb-3 text-slate-400 leading-relaxed">
                  This system makes <strong>ZERO</strong> external API calls. All reasoning, knowledge retrieval, and file generation occurs strictly on local hardware.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-[#121214] rounded-lg p-2.5 border border-surface-300">
                    <div className="text-slate-500 mb-0.5">Frontend Client</div>
                    <div className="font-mono text-emerald-400">http://localhost:3000</div>
                  </div>
                  <div className="bg-[#121214] rounded-lg p-2.5 border border-surface-300">
                    <div className="text-slate-500 mb-0.5">FastAPI Backend</div>
                    <div className="font-mono text-emerald-400">http://localhost:8000</div>
                  </div>
                  <div className="bg-[#121214] rounded-lg p-2.5 border border-surface-300">
                    <div className="text-slate-500 mb-0.5">Local LLM Engine</div>
                    <div className="font-mono text-emerald-400">http://localhost:11434 (Ollama)</div>
                  </div>
                  <div className="bg-[#121214] rounded-lg p-2.5 border border-surface-300">
                    <div className="text-slate-500 mb-0.5">Vector Knowledge Base</div>
                    <div className="font-mono text-emerald-400">ChromaDB (Embedded Storage)</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-200/40 border border-surface-300 rounded-xl p-4 space-y-2">
                <h3 className="text-slate-100 font-semibold text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400"/> Air-Gap Verification Steps for Judges
                </h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-400 leading-relaxed">
                  <li><strong>Physical Disconnect (Airplane Mode):</strong> You can disconnect from Wi-Fi completely. The system will continue to parse documents, run code, and generate reports.</li>
                  <li><strong>Browser Network Tab:</strong> Open Developer Tools (F12) &rarr; Network. Inspect all network traffic — 100% of network traffic routes strictly to <code>localhost</code>.</li>
                  <li><strong>Docker Container Isolation:</strong> Code execution runs in an ephemeral container with <code>--network none</code>, blocking all socket requests.</li>
                </ol>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
