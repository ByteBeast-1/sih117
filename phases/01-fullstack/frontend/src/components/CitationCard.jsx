import React from 'react';

// Reusable citation card — LibreChat-inspired clean dark card
export default function CitationCard({ citation }) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl transition-all"
      style={{ background: '#212121', border: '1px solid #2f2f2f' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#424242'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#2f2f2f'}
    >
      <div className="mt-0.5 flex-shrink-0" style={{ color: '#10a37f' }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#ececec' }}>{citation.document}</p>
        <p className="text-xs mt-0.5" style={{ color: '#8e8e8e' }}>
          Page {citation.page}
          {citation.subtopic && <span> · {citation.subtopic}</span>}
        </p>
      </div>
    </div>
  );
}
