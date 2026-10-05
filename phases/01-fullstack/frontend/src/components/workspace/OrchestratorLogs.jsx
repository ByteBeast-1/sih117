import { Terminal, Database, ArrowRight, BrainCircuit, Activity, Network } from 'lucide-react'

export default function OrchestratorLogs() {
  const logs = [
    { type: 'think', text: 'Analyzing intent...', time: '10:42:01' },
    { type: 'db', text: 'Retrieving context from Vector DB (MRPL_SOPs_v2)', time: '10:42:02' },
    { type: 'think', text: 'Intent mapped to: Maintenance Inquiry', time: '10:42:04' },
    { type: 'route', text: 'Routing prompt to Analyzer Agent', time: '10:42:05' }
  ]

  return (
    <div className="w-[350px] shrink-0 h-full bg-[#0a0a0b] border-l border-surface-300 flex flex-col font-mono relative overflow-hidden">
      
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-surface-300/50 bg-gradient-to-r from-blue-900/10 to-transparent relative z-10">
        <div className="w-7 h-7 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
          <BrainCircuit className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-[13px] font-semibold text-blue-100 tracking-widest uppercase">Orchestrator</div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <Activity className="w-3 h-3" /> ACTIVE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 relative z-10">
        
        {/* System Status Node */}
        <div className="bg-surface-200/40 backdrop-blur-md rounded-lg border border-surface-300/60 p-3 flex items-center gap-3">
          <div className="p-2 bg-[#131314] rounded-md border border-surface-300">
            <Network className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Routing Mesh</div>
            <div className="text-xs text-slate-200 mt-0.5">Monitoring active node jumps</div>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-3.5 before:w-px before:bg-gradient-to-b before:from-blue-500/50 before:via-surface-300 before:to-transparent">
          
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 relative animate-fade-in group" style={{ animationDelay: `${i * 150}ms` }}>
              <div className={`w-7 h-7 rounded-full bg-[#0a0a0b] border flex items-center justify-center shrink-0 z-10 transition-colors shadow-lg ${
                log.type === 'db' ? 'border-amber-500/50 group-hover:border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 
                log.type === 'route' ? 'border-blue-500/50 group-hover:border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 
                'border-surface-300 group-hover:border-slate-400'
              }`}>
                {log.type === 'think' && <Terminal className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />}
                {log.type === 'db' && <Database className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />}
                {log.type === 'route' && <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" />}
              </div>
              
              <div className="pt-1 flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${
                    log.type === 'db' ? 'text-amber-500' : log.type === 'route' ? 'text-blue-500' : 'text-slate-500'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">{log.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#131314]/80 p-3 rounded-lg border border-surface-300/40 group-hover:border-surface-300 transition-colors backdrop-blur-sm">
                  {log.text}
                </p>
              </div>
            </div>
          ))}
          
        </div>
        
        {/* Pulsing indicator at the bottom */}
        <div className="flex items-center gap-3 pl-[40px] pt-2 animate-pulse opacity-60">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          <div className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">Awaiting input...</div>
        </div>

      </div>
    </div>
  )
}
