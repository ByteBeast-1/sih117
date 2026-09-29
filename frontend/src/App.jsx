import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext } from 'react'
import Login from './pages/Login'
import ClientWorkbench from './pages/ClientWorkbench'
import AdminDashboard from './pages/AdminDashboard'
import AnalyzerAgent from './pages/AnalyzerAgent'
import CodeSandbox from './pages/CodeSandbox'
import GenerationAgent from './pages/GenerationAgent'

export const AuthContext = createContext(null)

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token')
  let user = null
  try { user = JSON.parse(localStorage.getItem('user') || 'null') } catch (e) { user = null }

  if (!token) return <Navigate to="/login" replace />
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch (e) { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = (userData, jwtToken) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', jwtToken)
    setUser(userData)
    setToken(jwtToken)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <Routes>
        <Route path="/login" element={token ? <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace /> : <Login />} />
        
        {/* The 4 Core Client Pages */}
        <Route path="/" element={<ProtectedRoute><ClientWorkbench /></ProtectedRoute>} />
        <Route path="/analyzer" element={<ProtectedRoute><AnalyzerAgent /></ProtectedRoute>} />
        <Route path="/generator" element={<ProtectedRoute><GenerationAgent /></ProtectedRoute>} />
        <Route path="/sandbox" element={<ProtectedRoute><CodeSandbox /></ProtectedRoute>} />
        
        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}
