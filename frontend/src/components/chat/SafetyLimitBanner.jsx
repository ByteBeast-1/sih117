import { AlertTriangle } from 'lucide-react'

export default function SafetyLimitBanner({ check }) {
  const isSafe = check.status === 'safe'
  return (
    <div className={`mt-3 flex items-start gap-2 px-4 py-3 rounded-lg border text-sm ${isSafe ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'}`}>
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      <div>
        <div className="font-semibold">{check.parameter}: {check.calculated_value} {check.unit}</div>
        <div className="text-xs mt-1">SOP Limit: {check.sop_limit} {check.unit} ({check.sop_reference})</div>
      </div>
    </div>
  )
}
