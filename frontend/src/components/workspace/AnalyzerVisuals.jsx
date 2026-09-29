import { useState } from 'react'
import { FileSearch, Activity, Layers, FileText, CheckCircle2, ChevronRight, BookOpen, BarChart3, TrendingUp, Zap, Server, UploadCloud } from 'lucide-react'

export default function AnalyzerVisuals() {
  const [hasDocument, setHasDocument] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setHasDocument(true)
    }, 1200)
  }

  const derivations = [
    "Extracting P&ID parameters from 'CDU_Manual_v3.pdf'",
    "Verifying pump P-101A mass flow balance...",
    "Math Check: 1500 kg/h * 0.85 efficiency = 1275 kg/h (Valid)",
    "Cross-referencing historical downtime logs for P-101A"
  ]

  const metrics = [
    { label: "Confidence", value: "98.4%", icon: Zap, color: "text-amber-400" },
    { label: "Data Points", value: "14,205", icon: Server, color: "text-blue-400" },
    { label: "Processing Time", value: "420ms", icon: Activity, color: "text-purple-400" }
  ]

  return (
    <div className="flex flex-col h-full bg-[#131314] font-sans">
      <div className="h-14 flex items-center px-4 border-b border-surface-300/50 bg-gradient-to-r from-surface-100 to-[#131314]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <FileSearch className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-medium text-[13px] text-slate-200 uppercase tracking-widest">Analysis Hub</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className={`status-dot ${hasDocument ? 'status-dot-online' : 'bg-slate-500'}`} />
          <span className={`text-[10px] font-mono tracking-wider ${hasDocument ? 'text-amber-500' : 'text-slate-500'}`}>
            {hasDocument ? 'SYNCED' : 'AWAITING INPUT'}
          </span>
        </div>
      </div>

      {!hasDocument ? (
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div 
              onClick={handleUpload}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all ${
                isUploading 
                  ? 'border-amber-500/50 bg-amber-500/5' 
                  : 'border-surface-300 hover:border-amber-500/30 hover:bg-surface-200/50'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isUploading ? 'bg-amber-500/20' : 'bg-surface-300/50'}`}>
                {isUploading ? (
                  <Activity className="w-8 h-8 text-amber-400 animate-pulse" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  {isUploading ? 'Ingesting Document...' : 'Upload Source Document'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isUploading ? 'Extracting schema and parameters' : 'Drag & drop PDF, CSV, or Excel file here'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-5 overflow-y-auto space-y-6 animate-fade-in">
          
          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            {metrics.map((m, i) => (
              <div key={i} className="bg-gradient-to-b from-surface-200/60 to-surface-200/20 border border-surface-300/60 rounded-xl p-3 backdrop-blur-sm shadow-sm relative overflow-hidden group">
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="flex items-center gap-2 mb-2">
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{m.label}</span>
                </div>
                <div className="text-xl font-semibold text-slate-100 tracking-tight">{m.value}</div>
              </div>
            ))}
          </div>

          {/* LOGS: Derivations & Checks */}
          <div className="space-y-3 relative">
            <div className="absolute left-3 top-8 bottom-4 w-px bg-surface-300/50" />
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-slate-400" /> Agent Derivations
              </div>
            </div>
            
            <div className="bg-[#1a1a1c]/80 backdrop-blur-md rounded-xl p-4 border border-surface-300/40 shadow-inner space-y-4 font-mono text-xs">
              {derivations.map((step, i) => (
                <div key={i} className="flex gap-3 text-slate-300 relative z-10 group">
                  <div className="w-6 h-6 rounded-full bg-[#131314] border border-surface-300 flex items-center justify-center shrink-0 group-hover:border-amber-500/50 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="leading-relaxed mt-1 group-hover:text-slate-200 transition-colors">{step}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-amber-400 relative z-10">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                </div>
                <span className="animate-pulse">Generating final diagnostic report...</span>
              </div>
            </div>
          </div>

          {/* Visuals: Graphs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" /> Data Distribution (Telemetry)
            </div>
            <div className="h-40 bg-gradient-to-b from-[#1a1a1c] to-[#131314] rounded-xl border border-surface-300/50 flex items-end justify-around p-4 relative overflow-hidden group">
              {/* Background grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {[40, 70, 45, 90, 65, 30, 85, 55, 75].map((height, i) => (
                <div key={i} className="relative w-8 group-hover:w-9 transition-all duration-300 flex flex-col justify-end items-center group/bar" style={{ height: '100%' }}>
                  <div 
                    className="w-full bg-gradient-to-t from-amber-600/40 to-amber-400/80 rounded-t shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-500 relative overflow-hidden" 
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-white/40" />
                  </div>
                  <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-6 text-[10px] text-amber-300 font-mono transition-opacity">{height}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visuals: Flowchart */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Extracted Process Flow
            </div>
            <div className="bg-[#1a1a1c] rounded-xl p-6 border border-surface-300/50 flex flex-col items-center gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent opacity-50" />
              
              <div className="relative z-10 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 text-amber-400 rounded-lg text-[11px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                Feed Storage (T-100)
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-px h-4 bg-gradient-to-b from-amber-500/50 to-blue-500/50" />
                <div className="w-1.5 h-1.5 rotate-45 border-b border-r border-blue-500/50" />
              </div>
              
              <div className="relative z-10 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 text-blue-400 rounded-lg text-[11px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                Charge Pump (P-101A)
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-px h-4 bg-gradient-to-b from-blue-500/50 to-purple-500/50" />
                <div className="w-1.5 h-1.5 rotate-45 border-b border-r border-purple-500/50" />
              </div>
              
              <div className="relative z-10 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 text-purple-400 rounded-lg text-[11px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.1)] animate-pulse">
                Preheat Train (E-101 to E-104)
              </div>
            </div>
          </div>

          {/* Citations */}
          <div className="space-y-3 pt-2">
             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
               <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Source Grounding
             </div>
            <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-surface-200/50 to-transparent border border-surface-300/80 rounded-xl hover:border-amber-500/40 cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[#1a1a1c] border border-surface-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">CDU_Manual_v3.pdf</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">Page 42, Section 3.1: Pump Specs</div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
