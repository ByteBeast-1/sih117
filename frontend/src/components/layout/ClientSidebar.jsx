import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../App'
import {
  Menu, History, Settings, Library, Search, LogOut, ChevronDown,
  Brain, FileSearch, Code2, FileOutput, FileText, Download
} from 'lucide-react'

const AGENTS = [
  { id: 'orchestrator', path: '/',            label: 'General Chat',     icon: Brain,      color: 'text-purple-400' },
  { id: 'analyzer',     path: '/analyzer',    label: 'Analyser Agent',   icon: FileSearch, color: 'text-amber-400' },
  { id: 'generator',    path: '/generator',   label: 'Generator AI',     icon: FileOutput, color: 'text-indigo-400' },
  { id: 'sandbox',      path: '/sandbox',     label: 'Code Sandbox',     icon: Code2,      color: 'text-teal-400' },
]

export default function ClientSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="h-full w-[260px] bg-[#131314] border-r border-surface-300 flex flex-col z-20 overflow-y-auto shrink-0">
      
      {/* Brand & Menu */}
      <div className="flex items-center gap-3 px-4 h-14 mt-2">
        <button className="p-2 text-slate-300 hover:bg-surface-200 rounded-full transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-medium text-slate-200 text-lg tracking-wide">MRPL Sovereign</div>
      </div>

      <div className="flex-1 px-3 py-4 flex flex-col gap-6">
        
        {/* AGENTS Section */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Workspace</div>
          <div className="space-y-1">
            {AGENTS.map((agent) => {
              const isActive = location.pathname === agent.path
              const Icon = agent.icon
              return (
                <button
                  key={agent.id}
                  onClick={() => navigate(agent.path)}
                  className={`w-full flex items-center px-3 py-2 gap-3 rounded-full transition-colors text-sm ${
                    isActive
                      ? 'bg-surface-200/50 text-slate-200 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? agent.color : ''}`} />
                  {agent.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ARTIFACTS Section (Generated Files) */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Artifacts</div>
          <div className="space-y-1">
            <button className="w-full flex justify-between items-center px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-surface-200 rounded-lg transition-colors text-xs group">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">Q3_Yield_Report.pdf</span>
              </div>
              <Download className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
            <button className="w-full flex justify-between items-center px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-surface-200 rounded-lg transition-colors text-xs group">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">Safety_Audit.pptx</span>
              </div>
              <Download className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
            <button className="w-full flex justify-between items-center px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-surface-200 rounded-lg transition-colors text-xs group">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Flow_Data.csv</span>
              </div>
              <Download className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          </div>
        </div>

        {/* HISTORY Section */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">History</div>
          <div className="group rounded-2xl transition-all duration-300 hover:bg-surface-200/30">
            <button className="w-full flex items-center px-3 py-2 gap-3 text-slate-400 group-hover:text-slate-200 rounded-full transition-colors text-sm">
              <History className="w-4 h-4" /> Chat History
            </button>
            <div className="h-0 overflow-hidden group-hover:h-[140px] transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 pl-4 pr-3">
              <div className="py-1 space-y-1 border-l border-surface-300/50 ml-3 pl-4 mb-2">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-1">Today</div>
                <button className="w-full text-left py-1 text-xs text-slate-400 hover:text-slate-200 truncate">
                  CDU-1 Pump Diagnostics
                </button>
                <button className="w-full text-left py-1 text-xs text-slate-400 hover:text-slate-200 truncate">
                  Q3 Yield Optimization
                </button>
                <button className="w-full text-left py-1 text-xs text-slate-400 hover:text-slate-200 truncate">
                  Valve Leak Simulation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MANAGE Section */}
        <div className="mt-auto pt-4">
          <div className="space-y-1">
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/admin')} className="w-full flex items-center px-3 py-2 gap-3 text-slate-400 hover:text-slate-200 hover:bg-surface-200 rounded-full transition-colors text-sm">
                <Settings className="w-4 h-4" /> Admin Dashboard
              </button>
            )}
            <button className="w-full flex items-center px-3 py-2 gap-3 text-slate-400 hover:text-slate-200 hover:bg-surface-200 rounded-full transition-colors text-sm">
              <Library className="w-4 h-4" /> MRPL SOP Docs
            </button>
          </div>
        </div>
      </div>

      {/* Bottom User Area */}
      <div className="p-4 border-t border-surface-300 relative shrink-0">
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-200 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-300 truncate">{user?.username || 'Guest'}</div>
            <div className="text-[10px] text-slate-500 truncate">{user?.role || 'user'}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            <div className="absolute bottom-full left-4 mb-2 w-56 bg-surface-100 border border-surface-300 rounded-lg shadow-xl z-50 p-2 animate-fade-in">
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
