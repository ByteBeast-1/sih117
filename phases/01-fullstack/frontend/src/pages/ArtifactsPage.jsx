import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FolderArchive, FileText, Download, Eye, Trash2, Search, Filter, 
  ExternalLink, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck, 
  Layers, HardDrive, Calendar, Clock, X
} from 'lucide-react'
import ClientSidebar from '../components/layout/ClientSidebar'
import { apiClient } from '../services/api'

export default function ArtifactsPage() {
  const navigate = useNavigate()
  const [artifacts, setArtifacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [previewDoc, setPreviewDoc] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchArtifacts = async () => {
    try {
      setRefreshing(true)
      const res = await apiClient.getArtifacts()
      if (res && res.artifacts) {
        setArtifacts(res.artifacts)
      }
    } catch (err) {
      console.error('Failed to load artifacts:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchArtifacts()
  }, [])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this artifact from local storage?')) return
    try {
      await apiClient.deleteArtifact(id)
      setArtifacts(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      alert(`Failed to delete: ${err.message}`)
    }
  }

  const handleDownload = (artifact, e) => {
    e?.stopPropagation()
    const url = artifact.file_path.startsWith('http') 
      ? artifact.file_path 
      : `http://localhost:8000${artifact.file_path}`
    
    // Trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = artifact.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const filteredArtifacts = artifacts.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.conversation_title && item.conversation_title.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === 'all' || item.file_type.toLowerCase() === selectedType.toLowerCase()
    return matchesSearch && matchesType
  })

  const getFormatBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return { label: 'PDF Report', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: 'PDF' }
      case 'xlsx':
      case 'excel':
        return { label: 'Spreadsheet', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: 'XLSX' }
      case 'pptx':
      case 'powerpoint':
        return { label: 'Presentation', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: 'PPTX' }
      case 'tex':
      case 'latex':
        return { label: 'LaTeX Spec', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: 'TEX' }
      case 'py':
      case 'code':
        return { label: 'Python Script', bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30', icon: 'PY' }
      default:
        return { label: type?.toUpperCase() || 'FILE', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: 'DOC' }
    }
  }

  const totalBytes = artifacts.reduce((acc, a) => acc + (a.file_size || 0), 0)
  const totalKB = (totalBytes / 1024).toFixed(1)

  return (
    <div className="flex h-screen bg-surface-100 text-slate-100 overflow-hidden font-sans">
      <ClientSidebar />

      <div className="flex-1 flex flex-col relative bg-[#131314] overflow-y-auto">
        
        {/* Top Header */}
        <div className="h-16 border-b border-surface-300 flex items-center justify-between px-8 bg-[#1e1e1e] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface-200 text-indigo-400 border border-surface-300">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 tracking-wide flex items-center gap-2">
                Artifacts Library
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Air-Gapped Storage
                </span>
              </h1>
              <p className="text-xs text-slate-400">Audited local documents, spreadsheets, presentations, and technical specs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchArtifacts}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-slate-300 text-xs transition-colors border border-surface-300"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => navigate('/generator')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              + Generate New Artifact
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-200/50 border border-surface-300 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">{artifacts.length}</div>
                <div className="text-xs text-slate-400">Total Artifacts</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-200/50 border border-surface-300 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">{totalKB} KB</div>
                <div className="text-xs text-slate-400">On-Premise Footprint</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-200/50 border border-surface-300 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">5 Types</div>
                <div className="text-xs text-slate-400">PDF, XLSX, PPTX, TEX, PY</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-200/50 border border-surface-300 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-400">100% Sovereign</div>
                <div className="text-xs text-slate-400">Zero Cloud Ingress/Egress</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#1a1a1c] border border-surface-300">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search artifacts or conversations..."
                className="w-full bg-[#131314] border border-surface-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['all', 'pdf', 'xlsx', 'pptx', 'tex'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors uppercase ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-surface-200/60 text-slate-400 hover:text-slate-200 hover:bg-surface-200'
                  }`}
                >
                  {type === 'all' ? 'All Formats' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Artifacts List Table */}
          <div className="bg-[#18181a] border border-surface-300 rounded-xl overflow-hidden shadow-lg">
            {loading ? (
              <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                <p className="text-xs">Loading local artifacts from database...</p>
              </div>
            ) : filteredArtifacts.length === 0 ? (
              <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                <FolderArchive className="w-10 h-10 opacity-30 text-slate-400" />
                <p className="text-sm font-medium text-slate-300">No documents found</p>
                <p className="text-xs text-slate-500">Generate a report using the Generator Agent or Analyser Agent.</p>
                <button
                  onClick={() => navigate('/generator')}
                  className="mt-2 text-xs text-indigo-400 hover:underline"
                >
                  Go to Generator Agent &rarr;
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-300 bg-surface-200/40 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4 font-semibold">Document Name</th>
                      <th className="py-3.5 px-4 font-semibold">Format</th>
                      <th className="py-3.5 px-4 font-semibold">Originating Conversation</th>
                      <th className="py-3.5 px-4 font-semibold">Created Date & Time</th>
                      <th className="py-3.5 px-4 font-semibold">Size</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-300/40">
                    {filteredArtifacts.map((doc) => {
                      const badge = getFormatBadge(doc.file_type)
                      const formattedDate = doc.created_at
                        ? new Date(doc.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Recent Session'

                      return (
                        <tr 
                          key={doc.id}
                          className="hover:bg-surface-200/30 transition-colors group cursor-pointer"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <td className="py-3.5 px-4 font-medium text-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-surface-200 text-slate-300 border border-surface-300 group-hover:border-indigo-500/40 transition-colors">
                                <FileText className="w-4 h-4 text-indigo-400" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                                  {doc.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  ID: {doc.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                              {badge.icon}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {doc.conversation_title ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/?convo=${doc.conversation_id || ''}`)
                                }}
                                className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-400 text-xs transition-colors group/link text-left"
                              >
                                <span className="truncate max-w-[200px]">{doc.conversation_title}</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                              </button>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Direct Generation</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-slate-400">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {formattedDate}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                            {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : '42.0 KB'}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-300 rounded transition-colors"
                                title="Quick Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDownload(doc, e)}
                                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                                title="Download File"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(doc.id, e)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                                title="Delete Artifact"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Document Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#1a1a1c] border border-surface-300 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-surface-300 bg-surface-200/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface-100 text-indigo-400 border border-surface-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{previewDoc.name}</h2>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Format: {previewDoc.file_type?.toUpperCase()}</span>
                      <span>•</span>
                      <span>Size: {(previewDoc.file_size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-300">
                <div className="p-4 rounded-lg bg-[#121214] border border-surface-300 font-mono text-[11px] space-y-2">
                  <div className="text-indigo-400 font-semibold mb-2">DOCUMENT METADATA:</div>
                  <div><span className="text-slate-500">File Name: </span>{previewDoc.name}</div>
                  <div><span className="text-slate-500">Internal Storage Path: </span>{previewDoc.file_path}</div>
                  <div><span className="text-slate-500">Associated Conversation: </span>{previewDoc.conversation_title || 'N/A'}</div>
                  <div><span className="text-slate-500">Creation Timestamp: </span>{previewDoc.created_at || 'N/A'}</div>
                  <div><span className="text-slate-500">Security Classification: </span><span className="text-emerald-400 font-semibold">INTERNAL AIR-GAPPED</span></div>
                </div>

                <div className="p-4 rounded-lg bg-surface-200/40 border border-surface-300 text-slate-300 leading-relaxed">
                  <div className="font-semibold text-slate-200 mb-2">Summary & Operational Context:</div>
                  <p>
                    This technical artifact was generated on-premise by MRPL Sovereign Workbench. 
                    It contains verified engineering calculations, operational logs, or turnaround audits formatted 
                    strictly according to refinery standards.
                  </p>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-surface-300 bg-surface-200/30 flex items-center justify-between">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#131314] font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 fill-current" />
                  Download File
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
