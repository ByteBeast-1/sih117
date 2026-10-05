import { BookOpen, Calculator, Code2, Image, FileOutput, Brain, AlertTriangle } from 'lucide-react'

/**
 * RoutingBadge — animated pill showing which agent handled the request.
 * Displays automatically based on the supervisor's routing decision.
 */
const agentConfig = {
  knowledge: { label: 'Knowledge Agent', icon: BookOpen, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  math: { label: 'Math & Calculation', icon: Calculator, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  coding: { label: 'Coding Agent', icon: Code2, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  vision: { label: 'Blueprint & Vision', icon: Image, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  generation: { label: 'Document Generator', icon: FileOutput, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  supervisor: { label: 'Supervisor Agent', icon: Brain, color: 'bg-sovereign-500/20 text-sovereign-400 border-sovereign-500/30' },
  error: { label: 'Error', icon: AlertTriangle, color: 'bg-danger/20 text-danger border-danger/30' },
}

export default function RoutingBadge({ agent }) {
  const config = agentConfig[agent] || agentConfig.supervisor
  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mb-2 animate-fade-in ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>Auto-routed → {config.label}</span>
    </div>
  )
}
