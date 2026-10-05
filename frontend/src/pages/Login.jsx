import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import { apiClient } from '../services/api'

/**
 * Clean, minimal GitHub/Obsidian-inspired Sign In Page
 * Dark, focused, distraction-free authentication for MRPL Sovereign Workbench
 */
export default function Login() {
  const [username, setUsername] = useState('eng_rajesh')
  const [password, setPassword] = useState('engineer123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleQuickFill = (u, p) => {
    setUsername(u)
    setPassword(p)
    setError('')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!username.trim() || !password.trim()) return
    setError('')
    setLoading(true)

    try {
      const data = await apiClient.login(username, password)
      login(data.user, data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.message || 'Incorrect username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col justify-between items-center py-12 px-4 select-none font-sans">
      
      {/* Top Section: Minimal Logo & Header */}
      <div className="w-full max-w-[340px] flex flex-col items-center mb-6">
        
        {/* Obsidian/GitHub-style Faceted Monogram */}
        <div className="w-12 h-12 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center mb-5 shadow-sm">
          <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.5 3.6-2.5 1.4-6.5-3.6 2.5-1.4zM5.5 8.6L11 11.7v6.6l-5.5-3.1V8.6zm13 8.6l-5.5 3.1v-6.6l5.5-3.1v6.6z" />
          </svg>
        </div>

        <h1 className="text-2xl font-light tracking-tight text-white">
          Sign in to Sovereign
        </h1>
        <p className="text-xs text-[#8b949e] mt-1">
          MRPL Engineering Operating System
        </p>
      </div>

      {/* Main Box: GitHub/Obsidian Clean Card */}
      <div className="w-full max-w-[340px] flex flex-col gap-4">
        
        {/* Error Callout */}
        {error && (
          <div className="p-3 bg-[#f85149]/15 border border-[#f85149]/40 rounded-md text-xs text-[#f85149] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Employee ID */}
            <div>
              <label htmlFor="login_field" className="block text-sm font-normal text-slate-200 mb-1.5">
                Username or employee ID
              </label>
              <input
                id="login_field"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password_field" className="block text-sm font-normal text-slate-200">
                  Password
                </label>
                <span className="text-xs text-[#58a6ff] hover:underline cursor-pointer">
                  Air-gapped local auth
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  id="password_field"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 pr-10 py-1.5 text-sm text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 text-[#8b949e] hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading || !username.trim() || !password.trim()}
                className="w-full py-2 px-3 rounded-md bg-[#238636] hover:bg-[#2ea043] active:bg-[#238636] text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Secondary Clean Box: Quick Persona Switcher */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4 text-center text-xs text-[#8b949e] flex flex-col gap-2">
          <span>Demo credentials for evaluation:</span>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('eng_rajesh', 'engineer123')}
              className={`px-3 py-1 rounded text-xs transition-colors border ${
                username === 'eng_rajesh'
                  ? 'bg-indigo-900/40 text-indigo-300 border-indigo-500/50'
                  : 'bg-[#0d1117] text-[#c9d1d9] border-[#30363d] hover:border-slate-500'
              }`}
            >
              Engineer (<span className="font-mono">eng_rajesh</span>)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'admin123')}
              className={`px-3 py-1 rounded text-xs transition-colors border ${
                username === 'admin'
                  ? 'bg-indigo-900/40 text-indigo-300 border-indigo-500/50'
                  : 'bg-[#0d1117] text-[#c9d1d9] border-[#30363d] hover:border-slate-500'
              }`}
            >
              Admin (<span className="font-mono">admin</span>)
            </button>
          </div>
        </div>

      </div>

      {/* Minimal Footer */}
      <footer className="w-full max-w-[400px] text-center text-[11px] text-[#8b949e] flex flex-col items-center gap-2 mt-8">
        <div className="flex items-center justify-center gap-4">
          <span className="hover:text-[#58a6ff] cursor-pointer">SOPs & Specs</span>
          <span>·</span>
          <span className="hover:text-[#58a6ff] cursor-pointer">Architecture Proof</span>
          <span>·</span>
          <span className="hover:text-[#58a6ff] cursor-pointer">Air-Gap Status</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#8b949e]/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% on-premise execution · Zero external API calls</span>
        </div>
      </footer>

    </div>
  )
}
