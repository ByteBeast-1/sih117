import { useNavigate } from 'react-router-dom'
import { Brain, FileSearch, Code2, FileOutput } from 'lucide-react'

/**
 * AgentExploreGrid — shows all 4 specialized agents as clickable cards.
 */

const AGENT_CARDS = [
  {
    id: 'analyzer',
    path: '/analyzer',
    name: 'Analyser Agent',
    desc: 'Upload PDFs, PPTs, excels, notes, and architectures. Gets structured response + math/pipeline checks.',
    icon: FileSearch,
    color: 'text-amber-400',
    bgHover: 'hover:border-amber-500/30',
  },
  {
    id: 'generator',
    path: '/generator',
    name: 'Generator AI',
    desc: 'Generate files (PDF, PPT, LaTeX, Markdown, Excel, CSV) from descriptions.',
    icon: FileOutput,
    color: 'text-indigo-400',
    bgHover: 'hover:border-indigo-500/30',
  },
  {
    id: 'sandbox',
    path: '/sandbox',
    name: 'Code Sandbox (Workspace)',
    desc: 'Workspace for code execution with Docker fallback for complex tasks.',
    icon: Code2,
    color: 'text-teal-400',
    bgHover: 'hover:border-teal-500/30',
  },
]

export default function AgentExploreGrid() {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-4xl animate-fade-in px-4">
      <h1 className="text-[28px] font-normal text-slate-200 mb-2 text-center md:text-left">
        Sovereign Workbench
      </h1>
      <p className="text-sm text-slate-500 mb-8 text-center md:text-left">
        Select a specialized agent or type a message below for the Orchestrator to handle it.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AGENT_CARDS.map((agent) => {
          const Icon = agent.icon
          return (
            <button
              key={agent.id}
              onClick={() => navigate(agent.path)}
              className={`flex flex-col text-left p-5 rounded-xl border border-surface-300 bg-surface-200/40 transition-all duration-200 hover:bg-surface-300/50 ${agent.bgHover}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-surface-100/50">
                  <Icon className={`w-5 h-5 ${agent.color}`} />
                </div>
                <h3 className="font-medium text-base text-slate-200">{agent.name}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-1">
                {agent.desc}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
