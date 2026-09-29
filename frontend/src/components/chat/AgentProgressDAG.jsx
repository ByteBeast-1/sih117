import { Check, Loader2 } from 'lucide-react'

export default function AgentProgressDAG({ agent }) {
  return (
    <div className="flex items-center gap-2 mb-2 text-xs overflow-x-auto pb-1">
      <div className="dag-step dag-step-done"><Check className="w-3 h-3" /> Intent</div>
      <div className="text-slate-500">→</div>
      <div className="dag-step dag-step-active"><Loader2 className="w-3 h-3 animate-spin" /> {agent} agent</div>
    </div>
  )
}
