import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { Shield, Eye, EyeOff, Zap, Lock } from 'lucide-react'
import { apiClient } from '../services/api'

/**
 * Login page — clean centered card with MRPL sovereign branding.
 * Authenticates via POST /api/v1/auth/login and redirects by role.
 */
export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await apiClient.login(username, password)
      login(data.user, data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sovereign-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sovereign-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sovereign-600/20 border border-sovereign-500/30 mb-4">
            <Shield className="w-8 h-8 text-sovereign-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">MRPL Sovereign Workbench</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Air-gapped AI assistant · 100% on-premise · Zero external calls
          </p>
        </div>

        {/* Login Card */}
        <div className="card-surface p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Employee ID / Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. eng_123"
                className="input-field w-full"
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field w-full pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 animate-fade-in">
                <Lock className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-5 border-t border-surface-300/50">
            <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setUsername('admin'); setPassword('admin123') }}
                className="btn-ghost text-center py-2 border border-surface-300/30 rounded-lg"
              >
                <span className="text-sovereign-400 font-medium">Admin</span>
                <br />admin / admin123
              </button>
              <button
                type="button"
                onClick={() => { setUsername('eng_rajesh'); setPassword('engineer123') }}
                className="btn-ghost text-center py-2 border border-surface-300/30 rounded-lg"
              >
                <span className="text-sovereign-400 font-medium">Engineer</span>
                <br />eng_rajesh / engineer123
              </button>
            </div>
          </div>
        </div>

        {/* Sovereign footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-600">
          <Shield className="w-3.5 h-3.5" />
          <span>All data stays on-premise · No internet connection required</span>
        </div>
      </div>
    </div>
  )
}
