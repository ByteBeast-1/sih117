import { Users } from 'lucide-react'

export default function ActiveSessions() {
  const sessions = [
    { user: 'eng_rajesh', dept: 'Process Engineering', status: 'Active', duration: '2h 14m' },
    { user: 'eng_priya', dept: 'Mechanical', status: 'Idle', duration: '4h 05m' },
    { user: 'operator_kumar', dept: 'Plant Operations', status: 'Active', duration: '0h 42m' },
  ]

  return (
    <div className="card-surface p-5">
      <h3 className="font-semibold text-slate-200 flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-sovereign-400" />
        Live Active Sessions
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-surface-200/50">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">User</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 rounded-tr-lg">Duration</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={i} className="border-b border-surface-300/30 hover:bg-surface-200/30">
                <td className="px-4 py-3 font-medium text-slate-200">{s.user}</td>
                <td className="px-4 py-3 text-slate-400">{s.dept}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{s.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
