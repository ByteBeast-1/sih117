import React, { useState } from 'react';
import { Search, ChevronDown, Sparkles, Table, Blocks, BookOpen, Wrench, Languages, Hammer, Monitor, FileText, Activity, Terminal } from 'lucide-react';

const MENU_GROUPS = [
  {
    group: 'System',
    items: [
      { id: 'features', label: 'Features', icon: Sparkles },
      { id: 'models', label: 'Model Registry', icon: Monitor },
      { id: 'files', label: 'File Management', icon: FileText },
      { id: 'clients', label: 'Client Monitoring', icon: Activity },
      { id: 'logs', label: 'System Logs', icon: Terminal },
    ],
  },
  {
    group: 'Documentation',
    items: [
      { id: 'docs-guide', label: 'User Guides', icon: BookOpen },
      { id: 'docs-setup', label: 'Installation', icon: Wrench },
      { id: 'docs-config', label: 'Configuration', icon: Table },
    ],
  },
];

/**
 * AdminSidebar — LibreChat-style left navigation panel.
 * Features: Dark gray background, Search box mockup, Version dropdown,
 * collapsable groups, icons, and specific hover/active states.
 */
export default function AdminSidebar({ activeSection, onSelect }) {
  const [expanded, setExpanded] = useState({
    'System': true,
    'Documentation': true,
  });

  const toggleGroup = (group) => {
    setExpanded(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <aside
      className="w-[280px] flex-shrink-0 h-full overflow-y-auto"
      style={{ background: '#111111', borderRight: '1px solid #222' }}
    >
      <div className="p-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          {/* Mock Logo */}
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
          <span className="font-semibold text-white text-base tracking-wide">
            Sovereign Workbench
          </span>
        </div>

        {/* Search Mockup */}
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg mb-4 transition-colors"
          style={{ background: '#171717', border: '1px solid #2a2a2a', color: '#a3a3a3' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = '#e5e5e5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#171717'; e.currentTarget.style.color = '#a3a3a3'; }}
        >
          <div className="flex items-center gap-2">
            <Search size={16} />
            <span className="text-sm">Search</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-black border border-[#333]">Ctrl</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-black border border-[#333]">K</span>
          </div>
        </button>

        {/* Version Dropdown Mockup */}
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg mb-6 transition-colors text-left"
          style={{ background: '#111111', border: '1px solid #2a2a2a' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#111111'; }}
        >
          <div>
            <p className="text-[11px]" style={{ color: '#888' }}>Version</p>
            <p className="text-sm font-medium text-white">v0.1.0 (latest)</p>
          </div>
          <ChevronDown size={16} color="#888" />
        </button>

        {/* Navigation Groups */}
        <div className="space-y-6">
          {MENU_GROUPS.map((section) => (
            <div key={section.group}>
              {/* Group toggle */}
              <button
                onClick={() => toggleGroup(section.group)}
                className="w-full flex items-center justify-between px-2 mb-2 group"
              >
                <span className="text-sm font-semibold tracking-wide" style={{ color: '#a3a3a3' }}>
                  {section.group}
                </span>
                <ChevronDown
                  size={14}
                  color="#666"
                  className={`transition-transform ${expanded[section.group] ? '' : '-rotate-90'}`}
                />
              </button>

              {/* Items */}
              {expanded[section.group] && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors"
                        style={{
                          background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                          color: isActive ? '#60a5fa' : '#a3a3a3',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = '#1a1a1a';
                            e.currentTarget.style.color = '#e5e5e5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#a3a3a3';
                          }
                        }}
                      >
                        <Icon size={18} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
