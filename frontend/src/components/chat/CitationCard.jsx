import { FileText, ExternalLink } from 'lucide-react'

/**
 * CitationCard — displays a source document reference with page and section.
 * Clicking opens a peek preview (future: shows the actual PDF excerpt).
 */
export default function CitationCard({ citation }) {
  return (
    <div className="citation-card group">
      <FileText className="w-4 h-4 text-sovereign-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-slate-200 font-medium truncate">{citation.document}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          Page {citation.page} · {citation.subtopic}
        </p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-sovereign-400 transition-colors shrink-0" />
    </div>
  )
}
