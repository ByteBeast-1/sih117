import { TerminalSquare, Play, Terminal, ChevronRight } from 'lucide-react'

export default function SandboxTerminal() {
  const codeLines = [
    { num: 1, text: <><span className="text-blue-400">def</span> <span className="text-amber-200">calculate_hoop_stress</span>(P, D, t):</> },
    { num: 2, text: <><span className="text-emerald-600/80">    """</span></> },
    { num: 3, text: <><span className="text-emerald-600/80">    P: Internal Pressure (MPa)</span></> },
    { num: 4, text: <><span className="text-emerald-600/80">    D: Pipe Diameter (mm)</span></> },
    { num: 5, text: <><span className="text-emerald-600/80">    t: Wall Thickness (mm)</span></> },
    { num: 6, text: <><span className="text-emerald-600/80">    """</span></> },
    { num: 7, text: <><span className="text-purple-400">    try</span>:</> },
    { num: 8, text: <>        stress = (P * D) / (<span className="text-orange-400">2</span> * t)</> },
    { num: 9, text: <><span className="text-purple-400">        return</span> stress</> },
    { num: 10, text: <><span className="text-purple-400">    except</span> <span className="text-amber-300">Exception</span> <span className="text-blue-400">as</span> e:</> },
    { num: 11, text: <><span className="text-purple-400">        return</span> <span className="text-blue-400">str</span>(e)</> },
    { num: 12, text: '' },
    { num: 13, text: <><span className="text-blue-300">print</span>(<span className="text-amber-400">f"Hoop Stress: </span>{'{'}calculate_hoop_stress(<span className="text-orange-400">12</span>, <span className="text-orange-400">500</span>, <span className="text-orange-400">20</span>){'}'}<span className="text-amber-400"> MPa"</span>)</> },
  ]

  return (
    <div className="flex flex-col h-full bg-[#131314] text-slate-300 font-mono text-[13px] rounded-xl border border-surface-300/50 shadow-2xl overflow-hidden relative group">
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1c] border-b border-surface-300/50 z-10">
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-200 font-medium">stress_calc.py</span>
        </div>
        <button className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded text-xs border border-emerald-500/30 hover:bg-emerald-500/20 transition-all hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <Play className="w-3.5 h-3.5" /> Run Code
        </button>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 p-4 overflow-auto bg-[#131314] relative z-10">
        {codeLines.map((line) => (
          <div key={line.num} className="flex hover:bg-white/[0.02] -mx-4 px-4 py-0.5">
            <div className="w-8 shrink-0 text-right pr-4 text-slate-600 select-none border-r border-surface-300/30 mr-4">
              {line.num}
            </div>
            <div className="whitespace-pre flex-1 tracking-wide">
              {line.text}
            </div>
          </div>
        ))}
        {/* Cursor */}
        <div className="flex -mx-4 px-4 py-0.5 mt-0.5">
          <div className="w-8 shrink-0 text-right pr-4 text-slate-600 select-none border-r border-surface-300/30 mr-4">14</div>
          <div className="w-2 h-4 bg-emerald-400/80 animate-pulse mt-0.5" />
        </div>
      </div>

      {/* Terminal Output */}
      <div className="h-40 bg-[#0a0a0b] border-t border-surface-300/50 flex flex-col z-10 relative">
        <div className="px-3 py-1.5 border-b border-surface-300/30 flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest bg-[#131314]">
          <Terminal className="w-3 h-3" /> Console Output
        </div>
        <div className="p-3 overflow-auto flex-1 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400">
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <span>python stress_calc.py</span>
          </div>
          <div className="pl-5 text-emerald-400/90 font-medium tracking-wide">
            Hoop Stress: 150.0 MPa
          </div>
          <div className="pl-5 text-slate-600 italic pt-2">
            Process finished with exit code 0
          </div>
        </div>
      </div>
    </div>
  )
}
