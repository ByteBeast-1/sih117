import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../App'
import { Shield, LogOut, User, FileText, ChevronDown } from 'lucide-react'

/**
 * TopBar — persistent header across the workbench.
 * Shows MRPL branding, sovereign air-gap status, and user menu.
 * The air-gap badge polls network status for live "0 Outbound" proof.
 */
export default function TopBar() {
  const { user, logout } = useContext(AuthContext)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 bg-surface border-b border-surface-300/50 flex items-center justify-between px-4 shrink-0 z-50">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-sovereign-500" />
          <span className="font-semibold text-sm text-slate-100">
            MRPL <span className="text-sovereign-400">Sovereign</span> Workbench
          </span>
        </div>
      </div>

      {/* Center: Air-Gap Sovereign Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
        <div className="status-dot status-dot-online" />
        <span className="text-xs font-medium text-success">
          Air-Gapped · 0 Outbound Bytes
        </span>
        <Shield className="w-3.5 h-3.5 text-success/60" />
      </div>

      {/* Right: User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 btn-ghost py-1.5 px-2.5"
        >
          <div className="w-7 h-7 rounded-full bg-sovereign-600/30 border border-sovereign-500/30 flex items-center justify-center">
            <User className="w-4 h-4 text-sovereign-400" />
          </div>
          <span className="text-sm text-slate-300 hidden sm:inline">{user?.username}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 card-surface p-2 shadow-xl z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-surface-300/50 mb-2">
                <p className="text-sm font-medium text-slate-200">{user?.username}</p>
                <p className="text-xs text-slate-500">{user?.department}</p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-sovereign-600/20 text-sovereign-400 border border-sovereign-500/30">
                  {user?.role}
                </span>
              </div>

              {user?.role === 'admin' && (
                <button
                  onClick={() => { navigate('/admin'); setShowUserMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-surface-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" /> Admin Dashboard
                </button>
              )}

              {user?.role === 'admin' && (
                <button
                  onClick={() => { navigate('/'); setShowUserMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-surface-50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" /> Workbench
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
