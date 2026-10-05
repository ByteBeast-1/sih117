import { useNavigate } from 'react-router-dom'
import { FileSearch, Code2, FileOutput, FolderArchive } from 'lucide-react'

/**
 * AgentExploreGrid — shows all specialized agents as clickable cards.
 */

const AGENT_CARDS = [
  {
    id: 'analyzer',
    path: '/analyzer',
    name: 'Analyser Agent',
    desc: 'Deep multi-file extraction, delta-P checks, and technical specification audits.',
    icon: FileSearch,
    color: 'text-amber-400',
    bgHover: 'hover:border-amber-500/30',
  },
  {
    id: 'generator',
    path: '/generator',
    name: 'Generator AI',
    desc: 'Compile real PDF, PPTX, Excel, LaTeX, and CSV documents with live preview.',
    icon: FileOutput,
    color: 'text-indigo-400',
    bgHover: 'hover:border-indigo-500/30',
  },
  {
    id: 'sandbox',
    path: '/sandbox',
    name: 'Code Sandbox',
    desc: 'Air-gapped Docker container execution with simulated stdin and hardware audit.',
    icon: Code2,
    color: 'text-teal-400',
    bgHover: 'hover:border-teal-500/30',
  },
  {
    id: 'artifacts',
    path: '/artifacts',
    name: 'Artifacts Library',
    desc: 'Central repository of all generated documents, download logs, and conversation links.',
    icon: FolderArchive,
    color: 'text-blue-400',
    bgHover: 'hover:border-blue-500/30',
  },
]

export default function AgentExploreGrid() {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-5xl animate-fade-in px-4">
      <h1 className="text-[26px] font-bold text-slate-100 mb-1.5 text-center md:text-left tracking-tight">
        MRPL Sovereign Engineering Workbench
      </h1>
      <p className="text-xs text-slate-400 mb-6 text-center md:text-left">
        100% on-premise industrial AI agents. Select a module below or query the supervisor directly.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
