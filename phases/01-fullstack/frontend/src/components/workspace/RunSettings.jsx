import { useState } from 'react'
import { Code, X, ChevronDown, Check } from 'lucide-react'

export default function RunSettings() {
  const [temperature, setTemperature] = useState(0.7)
  const [tools, setTools] = useState({
    structured: false,
    code: false,
    functionCalling: false,
    grounding: true
  })

  const ToolToggle = ({ label, id, showEdit }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        {showEdit && <span className="text-[11px] text-slate-500 cursor-pointer hover:text-slate-300">Edit</span>}
        <button 
          onClick={() => setTools(prev => ({...prev, [id]: !prev[id]}))}
          className={`w-9 h-5 rounded-full relative transition-colors ${tools[id] ? 'bg-blue-500' : 'bg-surface-300'}`}
        >
          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all ${tools[id] ? 'left-[20px]' : 'left-[4px]'}`} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="w-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-surface-300/50 mt-2">
        <div className="text-[13px] font-medium text-slate-400">Run settings</div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-surface-200 rounded text-slate-300 text-[13px] transition-colors">
            <Code className="w-3.5 h-3.5" /> Get code
          </button>
          <button className="p-1 hover:bg-surface-200 rounded text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Model Selector */}
        <div className="space-y-2">
          <div className="w-full bg-surface-200 border border-surface-300 rounded-xl p-3 cursor-pointer hover:border-slate-500 transition-colors relative">
            <div className="text-sm font-medium text-slate-200 mb-1">qwen2.5:7b-instruct</div>
            <div className="text-xs text-slate-500 leading-snug">Local high-performance routing model for general engineering tasks.</div>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
          </div>
        </div>

        {/* System Instructions */}
        <div className="space-y-2">
          <div className="w-full bg-surface-200 border border-surface-300 rounded-xl p-3 cursor-text hover:border-slate-500 transition-colors min-h-[80px]">
            <div className="text-sm font-medium text-slate-300 mb-1">System instructions</div>
            <div className="text-xs text-slate-500">Optional tone and style instructions for the model</div>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Temperature</span>
            <span className="text-xs text-slate-500">{temperature.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0" max="2" step="0.1" 
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1 bg-surface-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Thinking level */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-300">Thinking level</div>
          <div className="w-full bg-surface-200 border border-surface-300 rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:border-slate-500 transition-colors">
            <span className="text-sm text-slate-200">High</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-2 pt-2 border-t border-surface-300/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">Tools</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
          <ToolToggle label="Structured outputs" id="structured" showEdit />
          <ToolToggle label="Code execution" id="code" />
          <ToolToggle label="Function calling" id="functionCalling" showEdit />
          <div className="mt-4 pt-4 border-t border-surface-300/30">
            <ToolToggle label="Grounding with Knowledge Base" id="grounding" />
            <div className="text-[11px] text-slate-500 mt-1 pl-1">Source: <span className="text-blue-400">MRPL SOPs</span></div>
          </div>
        </div>

      </div>
    </div>
  )
}
