import { useState } from 'react'

export default function EditConfirmationModal({ edits, onAccept, onReject }) {
  const [accepted, setAccepted] = useState(false)
  
  if (accepted) return <div className="text-success text-sm mt-2">Changes applied.</div>

  return (
    <div className="mt-3 card-surface border-sovereign-500/50 p-4">
      <h4 className="text-sm font-semibold text-slate-200 mb-2">Proposed Code Changes</h4>
      {edits.map((edit, idx) => (
        <div key={idx} className="mb-4">
          <div className="text-xs text-slate-400 mb-1">{edit.filename}</div>
          <pre className="text-xs font-mono bg-surface-100 p-2 rounded overflow-x-auto text-slate-300">
            {edit.diff}
          </pre>
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={() => { setAccepted(true); onAccept(edits[0]); }} className="btn-primary text-xs py-1.5">Apply Changes</button>
        <button onClick={onReject} className="btn-ghost text-xs py-1.5 border border-surface-300">Reject</button>
      </div>
    </div>
  )
}
