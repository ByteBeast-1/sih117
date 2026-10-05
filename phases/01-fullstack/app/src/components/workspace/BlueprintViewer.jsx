import { useState } from 'react'
import { Image as ImageIcon, ZoomIn, ZoomOut, Maximize } from 'lucide-react'

export default function BlueprintViewer() {
  const [activeTag, setActiveTag] = useState(null)

  // Mock interactive regions on a dummy blueprint SVG
  const tags = [
    { id: 'CV-204', x: 30, y: 40, desc: 'Control Valve (Feed)' },
    { id: 'E-102', x: 60, y: 30, desc: 'Heat Exchanger' },
    { id: 'C-301', x: 50, y: 70, desc: 'Distillation Column' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-surface-300/50">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          CDU-1 P&ID Schematic
        </h2>
        <div className="flex gap-1">
          <button className="btn-ghost p-1.5"><ZoomIn className="w-4 h-4" /></button>
          <button className="btn-ghost p-1.5"><ZoomOut className="w-4 h-4" /></button>
          <button className="btn-ghost p-1.5"><Maximize className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Blueprint Canvas Area */}
      <div className="flex-1 relative bg-surface-200 overflow-hidden flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg aspect-[4/3] bg-surface-50 border border-surface-300 rounded-lg shadow-inner overflow-hidden">
          
          {/* Mock Schematic Drawing */}
          <svg className="w-full h-full text-slate-600" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Pipes */}
            <path d="M 10 40 L 30 40 L 30 70 L 50 70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M 50 70 L 70 70 L 70 30 L 90 30" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>

          {/* Interactive Tags */}
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`absolute w-12 h-8 -ml-6 -mt-4 rounded border-2 text-xs font-bold transition-all ${
                activeTag === tag.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 z-10 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-surface-100/80 border-surface-400 text-slate-300 hover:border-amber-500/50'
              }`}
              style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
            >
              {tag.id}
            </button>
          ))}
        </div>
      </div>

      {/* Context Panel */}
      {activeTag && (
        <div className="h-32 bg-surface-100 border-t border-surface-300/50 p-4 animate-slide-up">
          <h3 className="font-semibold text-amber-400">{activeTag}</h3>
          <p className="text-sm text-slate-300 mt-1">{tags.find(t => t.id === activeTag)?.desc}</p>
          <p className="text-xs text-slate-500 mt-2">
            Tip: Ask the AI "What is the maintenance schedule for this selected equipment?"
          </p>
        </div>
      )}
    </div>
  )
}
