import { Flame, FileText } from 'lucide-react'

export default function DataAccessHeatmap() {
  const documents = [
    { name: 'Pressure_Safety_SOP_v3.pdf', count: 142, type: 'Safety SOP', color: 'bg-danger/20 text-danger border-danger/30' },
    { name: 'CDU_Schematic_1.pdf', count: 89, type: 'P&ID Blueprint', color: 'bg-warning/20 text-warning border-warning/30' },
    { name: 'Engineering_Formulas.pdf', count: 56, type: 'Technical Doc', color: 'bg-success/20 text-success border-success/30' },
    { name: 'Pump_Maintenance_Log.xlsx', count: 21, type: 'Log', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  ]

  const maxCount = Math.max(...documents.map(d => d.count))

  return (
    <div className="card-surface p-5 h-full">
      <h3 className="font-semibold text-slate-200 flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-warning" />
        Data Access Heatmap
      </h3>
      <div className="space-y-4">
        {documents.map((doc, i) => {
          const width = Math.max(15, (doc.count / maxCount) * 100)
          return (
            <div key={i}>
              <div className="flex justify-between items-end mb-1 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-300">
                  <FileText className="w-3.5 h-3.5 opacity-70" />
                  {doc.name}
                </div>
                <span className="text-slate-500 font-mono">{doc.count} reads</span>
              </div>
              <div className="w-full h-2 bg-surface-300/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full border ${doc.color}`} 
                  style={{ width: `${width}%` }} 
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
