import { useState } from 'react'
import { ChevronDown, ChevronRight, BrainCircuit } from 'lucide-react'

export default function ThinkingTrace({ trace }) {
  const [isOpen, setIsOpen] = useState(true)

  if (!trace || trace.length === 0) return null

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-slate-300 transition-colors py-1 mb-1"
      >
        <BrainCircuit className="w-4 h-4" />
        <span>Thinking Process</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronRight className="w-3.5 h-3.5 ml-1" />}
      </button>

      {isOpen && (
        <div className="mt-1 ml-2 pl-4 border-l-2 border-surface-400/30 text-sm text-slate-400 space-y-2 animate-fade-in font-serif italic">
          {trace.map((step, i) => (
            <div key={i} className="leading-relaxed">
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
