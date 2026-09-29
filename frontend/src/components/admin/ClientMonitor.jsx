import React from 'react';

/**
 * ClientMonitor — full-page client usage monitoring dashboard.
 * Shows connected clients, their activity, model usage, and session info.
 * Mock data for now — backend endpoint GET /api/v1/admin/clients TBD.
 */

const MOCK_CLIENTS = [
  { username: 'eng_rajesh', role: 'user', ip: '192.168.1.105', lastActive: '2 min ago', queries: 47, topModel: 'qwen2.5:1.5b', topAgent: 'Knowledge', sessionHrs: '3.2h' },
  { username: 'eng_priya', role: 'user', ip: '192.168.1.112', lastActive: '15 min ago', queries: 23, topModel: 'qwen2.5-coder:1.5b', topAgent: 'Code Gen', sessionHrs: '1.5h' },
  { username: 'eng_kumar', role: 'user', ip: '192.168.1.118', lastActive: '1 hr ago', queries: 8, topModel: 'qwen2.5:1.5b', topAgent: 'Math', sessionHrs: '0.8h' },
  { username: 'mgr_sundar', role: 'user', ip: '192.168.1.102', lastActive: '3 hr ago', queries: 12, topModel: 'qwen2.5:1.5b', topAgent: 'Supervisor', sessionHrs: '2.1h' },
];

const SUMMARY_STATS = [
  { label: 'Active Sessions', value: '3', sub: 'right now' },
  { label: 'Queries Today', value: '90', sub: 'across all clients' },
  { label: 'Most Used Agent', value: 'Knowledge', sub: '52 queries' },
  { label: 'Avg Session', value: '1.9h', sub: 'per user' },
];

export default function ClientMonitor() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Client Monitoring</h1>
      <p className="text-sm mb-6" style={{ color: '#888' }}>
        Monitor usage across all connected client systems.
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {SUMMARY_STATS.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-lg"
            style={{ background: '#171717', border: '1px solid #2a2a2a' }}
          >
            <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: '#666' }}>
              {stat.label}
            </p>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#555' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Client table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#171717' }}>
              {['User', 'IP Address', 'Last Active', 'Queries', 'Top Agent', 'Top Model', 'Session'].map((h) => (
                <th key={h} className="text-left py-3 px-4 font-medium text-white text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_CLIENTS.map((client, i) => (
              <tr
                key={client.username}
                style={{ borderTop: '1px solid #1e1e1e', background: i % 2 === 0 ? '#0d0d0d' : '#111111' }}
              >
                <td className="py-3 px-4">
                  <p className="text-xs font-medium text-white">{client.username}</p>
                  <p className="text-[10px]" style={{ color: '#555' }}>{client.role}</p>
                </td>
                <td className="py-3 px-4 text-xs font-mono" style={{ color: '#888' }}>{client.ip}</td>
                <td className="py-3 px-4 text-xs" style={{ color: '#888' }}>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: client.lastActive.includes('min') ? '#10a37f' : '#555' }}
                    />
                    {client.lastActive}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs font-mono text-white">{client.queries}</td>
                <td className="py-3 px-4">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>
                    {client.topAgent}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs font-mono" style={{ color: '#888' }}>{client.topModel}</td>
                <td className="py-3 px-4 text-xs" style={{ color: '#888' }}>{client.sessionHrs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
