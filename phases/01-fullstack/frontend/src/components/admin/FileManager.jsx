import React, { useState } from 'react';

/**
 * FileManager — simple file browser for organization documents.
 * Allows viewing, creating folders, and uploading files
 * to the local document store used by the RAG pipeline.
 * Currently uses mock data — backend endpoints TBD.
 */

const INITIAL_FILES = [
  { name: 'SOPs', type: 'folder', children: [
    { name: 'SOP-001-Startup-Procedure.pdf', type: 'file', size: '2.4 MB', modified: '2026-08-15' },
    { name: 'SOP-002-Emergency-Shutdown.pdf', type: 'file', size: '1.8 MB', modified: '2026-08-20' },
    { name: 'SOP-003-Valve-Maintenance.pdf', type: 'file', size: '3.1 MB', modified: '2026-09-01' },
  ]},
  { name: 'Standards', type: 'folder', children: [
    { name: 'IS-2062-Steel-Spec.pdf', type: 'file', size: '5.6 MB', modified: '2026-07-10' },
    { name: 'API-610-Pumps.pdf', type: 'file', size: '8.2 MB', modified: '2026-07-10' },
    { name: 'ASME-B31.3-Process-Piping.pdf', type: 'file', size: '12.4 MB', modified: '2026-06-22' },
  ]},
  { name: 'Equipment-Manuals', type: 'folder', children: [
    { name: 'Boiler-HRB-400-Manual.pdf', type: 'file', size: '4.7 MB', modified: '2026-09-05' },
  ]},
  { name: 'Training-Materials', type: 'folder', children: [] },
];

export default function FileManager() {
  const [files] = useState(INITIAL_FILES);
  const [selectedFolder, setSelectedFolder] = useState('SOPs');
  const [showUpload, setShowUpload] = useState(false);

  const currentFolder = files.find((f) => f.name === selectedFolder);
  const currentFiles = currentFolder?.children || [];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">File Management</h1>
      <p className="text-sm mb-6" style={{ color: '#888' }}>
        Manage organization documents used by the Knowledge Agent for RAG retrieval.
      </p>

      <div className="flex gap-4" style={{ minHeight: '500px' }}>
        {/* Folder tree (left) */}
        <div
          className="w-56 flex-shrink-0 rounded-lg p-3"
          style={{ background: '#111111', border: '1px solid #2a2a2a' }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#555' }}>
            Folders
          </p>
          <div className="space-y-0.5">
            {files.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setSelectedFolder(folder.name)}
                className="w-full text-left px-3 py-2 rounded-md text-[13px] flex items-center gap-2 transition-colors"
                style={{
                  background: selectedFolder === folder.name ? '#1e1e1e' : 'transparent',
                  color: selectedFolder === folder.name ? '#fff' : '#999',
                }}
              >
                <span className="text-xs">📁</span>
                {folder.name}
                <span className="ml-auto text-[10px]" style={{ color: '#555' }}>
                  {folder.children.length}
                </span>
              </button>
            ))}
          </div>

          <button
            className="w-full mt-4 px-3 py-2 rounded-md text-xs font-medium text-center transition-colors"
            style={{ border: '1px dashed #2a2a2a', color: '#666' }}
          >
            + New Folder
          </button>
        </div>

        {/* File list (right) */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-white">
              {selectedFolder}
              <span className="ml-2 text-xs" style={{ color: '#666' }}>
                {currentFiles.length} file{currentFiles.length !== 1 ? 's' : ''}
              </span>
            </p>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors"
              style={{ background: '#2563eb' }}
            >
              Upload File
            </button>
          </div>

          {/* Upload area (shown on click) */}
          {showUpload && (
            <div
              className="p-6 rounded-lg mb-4 text-center cursor-pointer transition-colors"
              style={{ border: '2px dashed #2a2a2a', background: '#111111' }}
            >
              <p className="text-sm" style={{ color: '#999' }}>
                Drop files here or click to browse
              </p>
              <p className="text-[10px] mt-1" style={{ color: '#555' }}>
                PDF, DOCX, TXT, CSV — max 50MB per file
              </p>
            </div>
          )}

          {/* File table */}
          {currentFiles.length > 0 ? (
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#171717' }}>
                    <th className="text-left py-2.5 px-4 font-medium text-white text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-2.5 px-4 font-medium text-white text-xs uppercase tracking-wider">Size</th>
                    <th className="text-left py-2.5 px-4 font-medium text-white text-xs uppercase tracking-wider">Modified</th>
                    <th className="text-right py-2.5 px-4 font-medium text-white text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFiles.map((file, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #1e1e1e', background: i % 2 === 0 ? '#0d0d0d' : '#111111' }}>
                      <td className="py-2.5 px-4 text-xs text-white">{file.name}</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: '#888' }}>{file.size}</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: '#888' }}>{file.modified}</td>
                      <td className="py-2.5 px-4 text-right space-x-2">
                        <button className="text-xs px-2 py-1 rounded" style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)' }}>
                          Rename
                        </button>
                        <button className="text-xs px-2 py-1 rounded" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 rounded-lg" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
              <p className="text-sm" style={{ color: '#555' }}>This folder is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
