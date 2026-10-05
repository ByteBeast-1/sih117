import { useState } from 'react'
import { AlertOctagon, Lock } from 'lucide-react'

export default function DeadManSwitch() {
  const [lockedDown, setLockedDown] = useState(false)

  return (
    <div className={`card-surface p-6 h-full flex flex-col items-center justify-center transition-colors duration-500 ${
      lockedDown ? 'border-danger/50 bg-danger/10 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'border-danger/20'
    }`}>
      {lockedDown ? (
        <>
          <div className="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Lock className="w-10 h-10 text-danger" />
          </div>
          <h3 className="text-xl font-bold text-danger mb-2">SYSTEM LOCKED DOWN</h3>
          <p className="text-sm text-danger/80 text-center mb-6">
            All AI inference and sandbox execution has been physically severed. Active sessions terminated.
          </p>
          <button 
            onClick={() => setLockedDown(false)}
            className="btn-ghost border-danger text-danger hover:bg-danger/20 font-bold px-6 py-2"
          >
            AUTHORIZE RESTART
          </button>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-surface-300 rounded-full flex items-center justify-center mb-4">
            <AlertOctagon className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">Dead Man's Switch</h3>
          <p className="text-sm text-slate-400 text-center mb-6">
            Emergency kill switch. Sever all AI processing instantly.
          </p>
          <button 
            onClick={() => setLockedDown(true)}
            className="w-full max-w-[200px] bg-danger hover:bg-danger/80 text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105"
          >
            INITIATE LOCKDOWN
          </button>
        </>
      )}
    </div>
  )
}
