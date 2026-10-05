import { useState } from 'react'
import { FileDown, CheckCircle2 } from 'lucide-react'

export default function ShiftHandover() {
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    }, 2000)
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={generating || done}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        done 
          ? 'bg-success/20 text-success border border-success/30'
          : 'bg-surface-300 text-slate-200 hover:bg-surface-400 border border-surface-400/50'
      }`}
    >
      {generating ? (
        <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" />
      ) : done ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      {generating ? 'Compiling Log...' : done ? 'Handover Saved' : 'Shift Handover'}
    </button>
  )
}
