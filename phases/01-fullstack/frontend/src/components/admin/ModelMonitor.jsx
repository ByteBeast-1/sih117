import React, { useState } from 'react';

/**
 * ModelMonitor — full-page model registry panel.
 * Shows all registered models in a table with status indicators.
 * Provides a form to add new models to the registry.
 * Currently uses mock data — will call GET/POST /api/v1/agents/registry/models.
 */

const INITIAL_MODELS = [
  { name: 'qwen2.5:1.5b', role: 'general', status: 'online', vram: '1.2 GB' },
  { name: 'qwen2.5-coder:1.5b', role: 'coding', status: 'online', vram: '1.3 GB' },
];

export default function ModelMonitor() {
  const [models, setModels] = useState(INITIAL_MODELS);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('general');
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;
    setAdding(true);

    // TODO: POST /api/v1/agents/registry/models
    setTimeout(() => {
      setModels((prev) => [
        ...prev,
        { name: newName.trim(), role: newRole, status: 'loading', vram: '—' },
      ]);
      setNewName('');
      setNewRole('general');
      setAdding(false);
    }, 500);
  };

  const statusColor = {
    online: '#10a37f',
    offline: '#ef4444',
    loading: '#f59e0b',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Model Registry</h1>
      <p className="text-base mb-8" style={{ color: '#888' }}>
        Manage AI models connected to the workbench via Ollama.
      </p>

      {/* Connection status */}
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-xl mb-8"
        style={{ background: '#171717', border: '1px solid #2a2a2a' }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10a37f' }} />
        <span className="text-base" style={{ color: '#b4b4b4' }}>
          Ollama connected at <code className="text-sm font-mono px-2 py-1 rounded" style={{ background: '#0d0d0d', color: '#7dd3fc' }}>localhost:11434</code>
        </span>
      </div>

      {/* Models table */}
      <div className="rounded-lg overflow-hidden mb-8" style={{ border: '1px solid #2a2a2a' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#171717' }}>
              <th className="text-left py-3 px-4 font-medium text-white text-xs uppercase tracking-wider">Model</th>
              <th className="text-left py-3 px-4 font-medium text-white text-xs uppercase tracking-wider">Role</th>
              <th className="text-left py-3 px-4 font-medium text-white text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 font-medium text-white text-xs uppercase tracking-wider">VRAM</th>
              <th className="text-right py-3 px-4 font-medium text-white text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, i) => (
              <tr
                key={i}
                style={{ borderTop: '1px solid #1e1e1e', background: i % 2 === 0 ? '#0d0d0d' : '#111111' }}
              >
                <td className="py-3 px-4 font-mono text-xs text-white">{model.name}</td>
                <td className="py-3 px-4">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: model.role === 'coding' ? 'rgba(59,130,246,0.12)' : 'rgba(16,163,127,0.12)',
                      color: model.role === 'coding' ? '#60a5fa' : '#34d399',
                    }}
                  >
                    {model.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-2 text-xs" style={{ color: '#b4b4b4' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor[model.status] }} />
                    {model.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs font-mono" style={{ color: '#888' }}>{model.vram}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    className="text-xs px-2 py-1 rounded transition-colors"
                    style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}
                    onClick={() => setModels((prev) => prev.filter((_, j) => j !== i))}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add model form */}
      <div className="p-5 rounded-lg" style={{ background: '#171717', border: '1px solid #2a2a2a' }}>
        <p className="text-sm font-semibold text-white mb-4">Add Model</p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs mb-1.5" style={{ color: '#888' }}>Model Name (Ollama tag)</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. qwen2.5:3b"
              className="w-full px-3 py-2 rounded-md text-sm outline-none"
              style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', color: '#e5e5e5' }}
            />
          </div>
          <div className="w-40">
            <label className="block text-xs mb-1.5" style={{ color: '#888' }}>Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm outline-none"
              style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', color: '#e5e5e5' }}
            >
              <option value="general">general</option>
              <option value="coding">coding</option>
              <option value="vision">vision</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-40"
            style={{ background: '#2563eb' }}
          >
            {adding ? 'Adding...' : 'Add to Registry'}
          </button>
        </div>
      </div>
    </div>
  );
}
