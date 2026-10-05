export default function ExplanationToggle({ mode, onToggle }) {
  return (
    <div className="flex items-center gap-2 mt-2 border border-surface-300 rounded-lg p-1 w-fit bg-surface-200/50">
      <button 
        onClick={() => onToggle('operator')} 
        className={`px-3 py-1 text-xs rounded-md transition-colors ${mode === 'operator' ? 'bg-surface-300 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
      >
        Operator Summary
      </button>
      <button 
        onClick={() => onToggle('engineer')} 
        className={`px-3 py-1 text-xs rounded-md transition-colors ${mode === 'engineer' ? 'bg-surface-300 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
      >
        Engineering Derivation
      </button>
    </div>
  )
}
