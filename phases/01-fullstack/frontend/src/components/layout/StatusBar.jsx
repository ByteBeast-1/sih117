import { Cpu, GitBranch, Zap, Clock } from 'lucide-react'

/**
 * StatusBar — bottom bar showing active model, execution state,
 * branch name, and timing. Inspired by VS Code status bar
 * but stripped to only the essentials.
 */
export default function StatusBar({ activeModel, executionStatus, responseTime }) {
  return (
    <footer className="h-7 bg-surface border-t border-surface-300/50 flex items-center justify-between px-4 text-xs text-slate-500 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          feature/fullstack-ari
        </span>
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3" />
          {activeModel || 'qwen2.5:7b-instruct'}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {executionStatus || 'Idle'}
        </span>
        {responseTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {responseTime}
          </span>
        )}
      </div>
    </footer>
  )
}
