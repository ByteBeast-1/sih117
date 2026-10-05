import React, { useState } from 'react';

// Reusable collapsible thinking trace — LibreChat-inspired clean styling
// Per NON_NEGOTIABLES.md rule (d): makes citations trustworthy, not decorative
export default function ThinkingTrace({ steps }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#212121', border: '1px solid #2f2f2f' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all"
        style={{ color: '#b4b4b4' }}
        onMouseEnter={e => e.currentTarget.style.background = '#2f2f2f'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          Thinking ({steps.length} steps)
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid #2f2f2f' }}>
          <div className="pt-3" />
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: '#2f2f2f', color: '#8e8e8e' }}>
                {i + 1}
              </span>
              <span style={{ color: '#b4b4b4' }}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
