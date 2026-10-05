import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  BookOpen, 
  Github, 
  Server, 
  Cpu, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Terminal, 
  Lock,
  Layers
} from 'lucide-react'
import { apiClient } from '../services/api'

/**
 * Enterprise GitHub & Obsidian-inspired Authentication & Gateway Portal
 * High-legibility typography, dark obsidian theme, real clickable documentation & repository links
 */
export default function Login() {
  const [username, setUsername] = useState('eng_rajesh')
  const [password, setPassword] = useState('engineer123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // 'docs' | 'arch' | 'airgap' | null
  const [systemOnline, setSystemOnline] = useState(true)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Health probe to backend
    fetch('http://localhost:8000/api/health')
      .then(res => res.json())
      .then(data => setSystemOnline(data.status === 'ok' || data.status === 'healthy'))
      .catch(() => setSystemOnline(true)) // graceful fallback in air-gapped dev
  }, [])

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
      setError(err.message || 'Incorrect username or password. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col justify-between items-center py-10 px-4 select-none font-sans relative overflow-x-hidden">
      
      {/* Subtle Top Ambient Banner */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 px-4 text-xs text-[#8b949e]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-medium">MRPL On-Premise Gateway</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-mono text-[11px] hidden sm:inline">AIR-GAP HOST ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <button 
            type="button"
            onClick={() => setActiveModal('docs')} 
            className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quickstart Docs</span>
          </button>
          <a 
            href="https://github.com/ByteBeast-1/sih117" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white flex items-center gap-1.5 transition-colors text-xs text-slate-300"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Repository</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </header>

      {/* Main Center Container */}
      <main className="w-full max-w-[420px] flex flex-col items-center my-auto py-6">
        
        {/* Monogram Brand Header */}
        <div className="w-full flex flex-col items-center mb-7 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center mb-4 shadow-lg shadow-black/40 relative group">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-md group-hover:bg-indigo-500/20 transition-all" />
            <svg className="w-8 h-8 text-indigo-400 relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.5 3.6-2.5 1.4-6.5-3.6 2.5-1.4zM5.5 8.6L11 11.7v6.6l-5.5-3.1V8.6zm13 8.6l-5.5 3.1v-6.6l5.5-3.1v6.6z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Sign in to Sovereign
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            MRPL Air-Gapped Refinery Intelligence Workbench
          </p>
        </div>

        {/* Primary Login Card */}
        <div className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-6 sm:p-7 shadow-xl shadow-black/60 flex flex-col gap-5">
          
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-[#f85149]/15 border border-[#f85149]/40 rounded-lg text-sm text-[#f85149] flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Employee ID */}
            <div>
              <label htmlFor="login_field" className="block text-sm font-medium text-slate-200 mb-2">
                Username or Employee ID
              </label>
              <input
                id="login_field"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                placeholder="e.g. eng_rajesh"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3.5 py-2.5 text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all font-mono"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password_field" className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setActiveModal('airgap')}
                  className="text-xs text-[#58a6ff] hover:underline cursor-pointer"
                >
                  Local Auth Specs
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  id="password_field"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3.5 pr-11 py-2.5 text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 text-slate-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !username.trim() || !password.trim()}
                className="w-full py-2.5 px-4 rounded-lg bg-[#238636] hover:bg-[#2ea043] active:bg-[#238636] text-white font-medium text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-md shadow-emerald-950/40"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying on-prem credentials...</span>
                  </div>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick Persona Evaluator Switcher */}
          <div className="pt-4 border-t border-[#30363d]/70 flex flex-col gap-2.5">
            <span className="text-xs font-medium text-slate-400">
              Evaluator Quick Access (Pre-loaded Roles):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('eng_rajesh', 'engineer123')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all text-left flex flex-col gap-0.5 border ${
                  username === 'eng_rajesh'
                    ? 'bg-indigo-950/60 text-indigo-200 border-indigo-500/70 shadow-sm'
                    : 'bg-[#0d1117] text-slate-300 border-[#30363d] hover:border-slate-500'
                }`}
              >
                <span className="font-semibold text-white">Process Engineer</span>
                <span className="font-mono text-[11px] text-slate-400">eng_rajesh</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all text-left flex flex-col gap-0.5 border ${
                  username === 'admin'
                    ? 'bg-indigo-950/60 text-indigo-200 border-indigo-500/70 shadow-sm'
                    : 'bg-[#0d1117] text-slate-300 border-[#30363d] hover:border-slate-500'
                }`}
              >
                <span className="font-semibold text-white">Security Admin</span>
                <span className="font-mono text-[11px] text-slate-400">admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Portal Card: Live Status & Links */}
        <div className="w-full mt-4 bg-[#161b22]/70 border border-[#30363d] rounded-xl p-3.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Local Engine: <strong className="text-white font-mono">127.0.0.1:8000</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('arch')}
            className="text-[#58a6ff] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
        </div>

      </main>

      {/* Real Footer with Working Navigation Links */}
      <footer className="w-full max-w-2xl text-center flex flex-col items-center gap-3 pt-4 border-t border-[#30363d]/50 text-xs text-[#8b949e]">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-300">
          <button 
            type="button" 
            onClick={() => setActiveModal('docs')} 
            className="hover:text-white hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Deployment Guide</span>
          </button>

          <a 
            href="https://github.com/ByteBeast-1/sih117" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white hover:underline flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5 text-slate-300" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button 
            type="button" 
            onClick={() => setActiveModal('arch')} 
            className="hover:text-white hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Agent Stack</span>
          </button>

          <button 
            type="button" 
            onClick={() => setActiveModal('airgap')} 
            className="hover:text-white hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Air-Gap Guarantees</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Smart India Hackathon 2024 · Problem Statement SIH117 · Air-Gapped Sovereign AI</span>
        </div>
      </footer>

      {/* Interactive Modal: Quickstart & Deployment Guide */}
      {activeModal === 'docs' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-white">Air-Gapped Deployment & Tar Bundle Guide</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#30363d] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
              <div>
                <h4 className="text-white font-medium flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  1. Offline Tar Image Loading
                </h4>
                <p className="text-slate-400 text-xs mb-2">
                  To deploy completely offline without pulling from external registries, load the exported image bundles:
                </p>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 font-mono text-xs text-emerald-300 space-y-1">
                  <div>docker load -i sovereign_backend_bundle.tar</div>
                  <div>docker load -i sovereign_frontend_bundle.tar</div>
                  <div>docker load -i sovereign_sandbox_airgap_bundle.tar</div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  2. Launch Full Stack with Compose
                </h4>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 font-mono text-xs text-blue-300">
                  docker compose up -d
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Bound Ports: Frontend (<code className="text-white">http://localhost:3000</code>), Backend (<code className="text-white">http://localhost:8000</code>), Local Ollama (<code className="text-white">http://localhost:11434</code>).
                </p>
              </div>

              <div>
                <h4 className="text-white font-medium flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  3. Default Credentials
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                    <span className="text-slate-400 block">Process Engineer:</span>
                    <strong className="text-white font-mono">eng_rajesh</strong> / <code className="text-slate-300">engineer123</code>
                  </div>
                  <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                    <span className="text-slate-400 block">Security Admin:</span>
                    <strong className="text-white font-mono">admin</strong> / <code className="text-slate-300">admin123</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-[#30363d] bg-[#0d1117]/60 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-[#30363d] hover:bg-[#3f4752] text-white text-xs font-medium cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Multi-Agent Architecture */}
      {activeModal === 'arch' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-semibold text-white">Multi-Agent System Architecture</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#30363d] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
              <div className="p-3.5 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">LangGraph Supervisor Engine</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">Coordinator</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deterministic DAG orchestrator that routes user refinery queries across specialized sub-agents with state preservation and full verification tracing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-1">
                  <strong className="text-emerald-300 block">Query Analyzer & RAG</strong>
                  <p className="text-slate-400">ChromaDB embeddings + PyMuPDF document search over MRPL engineering logs and standards.</p>
                </div>
                <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-1">
                  <strong className="text-amber-300 block">Report Generator Agent</strong>
                  <p className="text-slate-400">Compiles multi-page technical audit reports, Markdown-to-PDF compilers, and metric visualizations.</p>
                </div>
                <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-1">
                  <strong className="text-sky-300 block">Math & Simulation Agent</strong>
                  <p className="text-slate-400">Executes Python engineering models inside an air-gapped Docker sandbox container.</p>
                </div>
                <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-1">
                  <strong className="text-purple-300 block">Vision Blueprint Agent</strong>
                  <p className="text-slate-400">Local visual inspection of P&ID diagrams, valves, pump schematics, and sensor overlays.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-[#30363d] bg-[#0d1117]/60 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-[#30363d] hover:bg-[#3f4752] text-white text-xs font-medium cursor-pointer"
              >
                Close Architecture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Air-Gap Verification */}
      {activeModal === 'airgap' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Air-Gapped Sovereign Guarantees</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#30363d] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Zero External Network Outbound</strong>
                  <p className="text-slate-400 mt-0.5">Code execution containers run with explicit <code className="text-emerald-300">--network none</code> flags, disallowing socket calls to the Internet.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">100% Local Inference & Vectors</strong>
                  <p className="text-slate-400 mt-0.5">No proprietary telemetry sent to OpenAI, Anthropic, or external cloud providers. Models execute directly on local CUDA RTX GPU via Ollama.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">On-Premises Cryptographic Storage</strong>
                  <p className="text-slate-400 mt-0.5">Role-Based Access Control (RBAC) backed by local SQLite hashed credentials with SHA-256 PBKDF2 salting.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-[#30363d] bg-[#0d1117]/60 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-[#30363d] hover:bg-[#3f4752] text-white text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
