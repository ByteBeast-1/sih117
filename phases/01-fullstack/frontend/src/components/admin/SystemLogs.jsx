import React, { useState } from 'react';

/**
 * SystemLogs — scrollable log viewer with filtering.
 * Shows timestamped log entries from gateway, agents, and sandbox.
 * Mock data for now — backend endpoint GET /api/v1/admin/logs TBD.
 */

const MOCK_LOGS = [
  { ts: '2026-09-29 10:05:12', level: 'INFO', source: 'gateway', msg: 'Server started on port 8000' },
  { ts: '2026-09-29 10:05:13', level: 'INFO', source: 'agents', msg: 'Agents service connected on port 9000' },
  { ts: '2026-09-29 10:05:14', level: 'INFO', source: 'agents', msg: 'Ollama health check passed (2 models loaded)' },
  { ts: '2026-09-29 10:05:15', level: 'INFO', source: 'gateway', msg: 'Database tables created, 2 users seeded' },
  { ts: '2026-09-29 10:06:02', level: 'INFO', source: 'gateway', msg: 'POST /api/v1/auth/login — user: admin — 200 OK' },
  { ts: '2026-09-29 10:07:34', level: 'INFO', source: 'gateway', msg: 'POST /api/v1/auth/login — user: eng_rajesh — 200 OK' },
  { ts: '2026-09-29 10:08:11', level: 'INFO', source: 'agents', msg: 'Knowledge query: "What is the startup procedure for HRB-400?" — routed to qwen2.5:1.5b' },
  { ts: '2026-09-29 10:08:14', level: 'INFO', source: 'agents', msg: 'RAG retrieval: 6 chunks from SOP-001-Startup-Procedure.pdf' },
  { ts: '2026-09-29 10:08:18', level: 'INFO', source: 'agents', msg: 'Knowledge response generated — grounded: true, citations: 3' },
  { ts: '2026-09-29 10:12:45', level: 'WARN', source: 'agents', msg: 'Model qwen2.5:1.5b response latency > 5s (took 7.2s)' },
  { ts: '2026-09-29 10:15:30', level: 'INFO', source: 'agents', msg: 'Math calculation: "pressure drop across 4-inch pipe" — 3 steps' },
  { ts: '2026-09-29 10:18:02', level: 'ERROR', source: 'sandbox', msg: 'Code execution timeout — script exceeded 30s limit, killed' },
  { ts: '2026-09-29 10:18:03', level: 'INFO', source: 'sandbox', msg: 'Container cleaned up after timeout' },
  { ts: '2026-09-29 10:22:15', level: 'WARN', source: 'gateway', msg: 'JWT token expired for user eng_kumar — 401 returned' },
  { ts: '2026-09-29 10:25:00', level: 'INFO', source: 'gateway', msg: 'POST /api/v1/auth/login — user: eng_kumar — 200 OK (re-auth)' },
  { ts: '2026-09-29 10:30:44', level: 'INFO', source: 'agents', msg: 'Vision analysis: blueprint_scan_v3.pdf — equipment tags: 8, yield: 91.2%' },
];

const LEVEL_COLORS = {
  INFO: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa' },
  WARN: { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24' },
  ERROR: { bg: 'rgba(239,68,68,0.1)', color: '#f87171' },
};

export default function SystemLogs() {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterSource, setFilterSource] = useState('ALL');

  const filtered = MOCK_LOGS.filter((log) => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (filterSource !== 'ALL' && log.source !== filterSource) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">System Logs</h1>
      <p className="text-sm mb-6" style={{ color: '#888' }}>
        View logs from all workbench services.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs" style={{ color: '#666' }}>Level:</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-2 py-1.5 rounded text-xs outline-none"
            style={{ background: '#171717', border: '1px solid #2a2a2a', color: '#e5e5e5' }}
          >
            <option value="ALL">All</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs" style={{ color: '#666' }}>Source:</label>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-2 py-1.5 rounded text-xs outline-none"
            style={{ background: '#171717', border: '1px solid #2a2a2a', color: '#e5e5e5' }}
          >
            <option value="ALL">All</option>
            <option value="gateway">Gateway</option>
            <option value="agents">Agents</option>
            <option value="sandbox">Sandbox</option>
          </select>
        </div>
        <span className="ml-auto text-[10px]" style={{ color: '#555' }}>
          Showing {filtered.length} of {MOCK_LOGS.length} entries
        </span>
      </div>

      {/* Log entries */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', maxHeight: '600px', overflowY: 'auto' }}
      >
        <div className="font-mono text-xs">
          {filtered.map((log, i) => {
            const lc = LEVEL_COLORS[log.level] || LEVEL_COLORS.INFO;
            return (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-2 transition-colors"
                style={{ borderBottom: '1px solid #141414' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#111111')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="flex-shrink-0 w-[145px]" style={{ color: '#555' }}>{log.ts}</span>
                <span
                  className="flex-shrink-0 w-12 text-center px-1 py-0.5 rounded text-[10px] font-semibold"
                  style={{ background: lc.bg, color: lc.color }}
                >
                  {log.level}
                </span>
                <span
                  className="flex-shrink-0 w-16 px-1.5 py-0.5 rounded text-[10px] text-center"
                  style={{ background: '#1a1a1a', color: '#888' }}
                >
                  {log.source}
                </span>
                <span style={{ color: '#c9c9c9' }}>{log.msg}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
