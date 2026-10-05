import { ShieldCheck, FileText } from 'lucide-react'

export default function AuditLedger() {
  const logs = [
    { id: '1042', time: '10:15 AM', user: 'eng_rajesh', action: 'Query', doc: 'Pressure_Safety_SOP_v3.pdf', hash: 'a3f2c1...' },
    { id: '1043', time: '10:18 AM', user: 'eng_rajesh', action: 'Math Calculation', doc: 'Engineering_Formulas.pdf', hash: 'b7e4d2...' },
    { id: '1044', time: '10:25 AM', user: 'eng_priya', action: 'Code Execution', doc: 'N/A', hash: 'c9a1f3...' },
    { id: '1045', time: '11:01 AM', user: 'operator_kumar', action: 'P&ID Vision', doc: 'CDU_Schematic_1.pdf', hash: 'd2b5e4...' },
  ]

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Zero-Trust Audit Ledger
        </h3>
        <button className="btn-ghost text-xs px-2 py-1 border border-surface-300">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-surface-200/50">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Time</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Document Accessed</th>
              <th className="px-4 py-3 rounded-tr-lg">Hash Chain</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-surface-300/30 hover:bg-surface-200/30">
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{log.time}</td>
                <td className="px-4 py-3 font-medium text-slate-200">{log.user}</td>
                <td className="px-4 py-3 text-slate-300">{log.action}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    {log.doc !== 'N/A' && <FileText className="w-3 h-3 text-cyan-400" />}
                    {log.doc}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-emerald-500/70">{log.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        Chain cryptographic integrity verified.
      </div>
    </div>
  )
}
