import { useState, useRef, useEffect } from 'react'
import { FileText, Download, FileArchive, FileSpreadsheet, Presentation, LayoutTemplate, ChevronDown, CheckCircle2, Copy, Eye, Share2, Wand2 } from 'lucide-react'

export default function GeneratorArtifact() {
  const [format, setFormat] = useState('Report')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)
  const dropdownRef = useRef(null)

  const formats = [
    { id: 'PDF', icon: FileArchive, label: 'PDF' },
    { id: 'PPT', icon: Presentation, label: 'PPT' },
    { id: 'Report', icon: FileText, label: 'Report' },
    { id: 'Excel', icon: FileSpreadsheet, label: 'Excel' },
    { id: 'Template', icon: LayoutTemplate, label: 'Template' }
  ]

  const activeFormat = formats.find(f => f.id === format)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Simulate generation effect
  useEffect(() => {
    setIsGenerating(true)
    const timer = setTimeout(() => setIsGenerating(false), 2000)
    return () => clearTimeout(timer)
  }, [format])

  return (
    <div className="flex flex-col h-full bg-[#0a0a0b] font-sans relative overflow-hidden">
      
      {/* Top Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-surface-300/50 bg-gradient-to-r from-[#131314] to-[#1a1a1c] relative z-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Wand2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <div className="font-semibold text-[13px] text-slate-100 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
              Artifact Generator
              {!isGenerating && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[9px] shrink-0">READY</span>}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">Q3_Maintenance_{format}_v2</div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          
          <div className="flex items-center gap-1 mr-2 px-3 py-1 bg-surface-200/50 border border-surface-300/50 rounded-md">
            <button className="p-1.5 hover:bg-surface-300 rounded text-slate-400 hover:text-slate-200 transition-colors" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-surface-300 rounded text-slate-400 hover:text-slate-200 transition-colors" title="Copy Content"><Copy className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-surface-300 rounded text-slate-400 hover:text-slate-200 transition-colors" title="Share"><Share2 className="w-3.5 h-3.5" /></button>
          </div>

          {/* Custom Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#131314] hover:bg-[#1a1a1c] text-slate-200 border border-surface-300 rounded-md text-xs font-semibold transition-colors min-w-[110px] justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                {activeFormat && <activeFormat.icon className={`w-3.5 h-3.5 ${isDropdownOpen ? 'text-indigo-400' : 'text-slate-400'}`} />}
                <span>{activeFormat?.label}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-full bg-[#1a1a1c] border border-surface-300 rounded-lg shadow-xl z-30 py-1 overflow-hidden animate-fade-in backdrop-blur-xl">
                {formats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setFormat(f.id); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-colors ${
                      format === f.id ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300 hover:bg-[#2d2d2d]'
                    }`}
                  >
                    <f.icon className={`w-3.5 h-3.5 ${format === f.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)] rounded-md text-xs font-semibold transition-all">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      {/* Artifact Preview Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-950/50 flex justify-center relative">
        
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Mock Document Page */}
        <div className="w-full max-w-2xl bg-white text-slate-800 p-10 rounded-xl shadow-2xl relative z-10 transition-all duration-500"
             style={{
               minHeight: '650px',
               opacity: isGenerating ? 0.6 : 1,
               transform: isGenerating ? 'scale(0.98) translateY(10px)' : 'scale(1) translateY(0)'
             }}>
          
          {isGenerating ? (
            <div className="animate-pulse space-y-8">
              <div className="flex items-center gap-3 mb-10 border-b pb-6 border-slate-200">
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-slate-200 rounded w-64"></div>
                  <div className="h-4 bg-slate-100 rounded w-32"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-3 bg-slate-100 rounded w-[90%]"></div>
                <div className="h-3 bg-slate-100 rounded w-[95%]"></div>
                <div className="h-3 bg-slate-100 rounded w-[80%]"></div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-slate-100 rounded w-full"></div>
                <div className="h-10 bg-slate-50 rounded w-full"></div>
                <div className="h-10 bg-slate-100 rounded w-full"></div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-6 mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center text-indigo-500">
                  {activeFormat && <activeFormat.icon className="w-6 h-6" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Q3 Maintenance {format}</h1>
                  <p className="text-sm text-slate-500 mt-1 font-mono">Generated by Agentic Orchestrator v2</p>
                </div>
              </div>
              
              <h2 className="text-lg font-bold text-slate-800 mt-8 mb-3 flex items-center gap-2">
                <span className="text-indigo-500">01.</span> Executive Summary
              </h2>
              <p className="mb-6 leading-relaxed text-[15px] text-slate-600">
                During Q3, the Crude Distillation Unit (CDU-1) underwent scheduled maintenance. All primary pumps (P-101A/B) were inspected utilizing automated diagnostic telemetry. Minor seal wear was detected on P-101A and replaced preemptively to avoid an estimated 14% yield drop.
              </p>
              
              <h2 className="text-lg font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2">
                <span className="text-indigo-500">02.</span> Equipment Status Matrix
              </h2>
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 font-semibold text-slate-700">Tag ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Equipment</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600">P-101A</td>
                      <td className="px-4 py-3 text-slate-700">Feed Pump (Primary)</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Operational
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600">P-101B</td>
                      <td className="px-4 py-3 text-slate-700">Feed Pump (Standby)</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Operational
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600">CV-204</td>
                      <td className="px-4 py-3 text-slate-700">Control Valve</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium text-xs border border-amber-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Needs Calibration
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
