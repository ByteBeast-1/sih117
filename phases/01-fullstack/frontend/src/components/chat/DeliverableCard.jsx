import { Download, FileText } from 'lucide-react'

export default function DeliverableCard({ file }) {
  return (
    <div className="mt-3 flex items-center justify-between p-3 card-surface border-sovereign-500/30">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-cyan-400" />
        <div>
          <div className="text-sm font-medium text-slate-200">{file.filename}</div>
          <div className="text-xs text-slate-500">Ready for download</div>
        </div>
      </div>
      <a href={file.download_url} className="p-2 btn-ghost text-sovereign-400 hover:text-sovereign-300">
        <Download className="w-4 h-4" />
      </a>
    </div>
  )
}
