import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navIcons = [
  { label: 'Chat', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />, route: '/shell/supervisor' },
  { label: 'Files', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />, route: '/shell/knowledge' },
  { label: 'Tools', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />, route: '/shell/math' },
  { label: 'Agents', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />, route: '/shell/blueprint' },
  { label: 'Settings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />, route: '/admin' }
];

const mockTasks = [
  { title: 'Valve Approval Note', tags: 'Image Analysis • Document Gen', time: '10:24 AM', active: true },
  { title: 'Gearbox Failure Analysis', tags: 'PDF Analysis • Root Cause', time: 'Yesterday', active: false },
  { title: 'Stress Report Review', tags: 'Document Analysis', time: 'May 19', active: false },
  { title: 'Material Spec Comparison', tags: 'Data Extraction', time: 'May 18', active: false },
  { title: 'Pump Assembly Inspection', tags: 'Image Analysis • Report', time: 'May 18', active: false },
  { title: 'Bearing Wear Assessment', tags: 'Image Analysis', time: 'May 17', active: false },
];

const mockRags = [
  { title: 'Engineering Docs', count: '12,842 documents', active: true },
  { title: 'Standards & Codes', count: '4,215 documents', active: true },
  { title: 'Historical Reports', count: '9,102 documents', active: true },
  { title: 'Design Repositories', count: '7,618 documents', active: false },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      {/* Far Left Bar (Icons) */}
      <div className="w-16 flex flex-col items-center py-4" style={{ background: 'var(--bg-deep)', borderRight: '1px solid var(--border-subtle)' }}>
        <button className="w-10 h-10 mb-6 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-hover)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        <div className="flex-1 flex flex-col gap-4">
          {navIcons.map((nav, i) => (
            <NavLink
              key={i}
              to={nav.route}
              className={({ isActive }) => `group w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${isActive ? 'bg-[var(--bg-card)] text-[var(--accent-blue)]' : 'text-gray-400 hover:text-gray-200 hover:bg-[var(--bg-hover)]'}`}
              title={nav.label}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {nav.icon}
              </svg>
              <span className="text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute mt-10 pointer-events-none bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                {nav.label}
              </span>
            </NavLink>
          ))}
        </div>

        <button 
          onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
          className="w-10 h-10 mt-auto rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-[var(--bg-hover)] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>

      {/* Mid Left Panel (Context/History) */}
      <div className="w-72 flex flex-col" style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border-subtle)' }}>
        
        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[var(--accent-blue)] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="font-semibold text-[15px] tracking-wide text-white">Sovereign AI Workbench</h1>
        </div>

        {/* Recent Tasks */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Recent Tasks</span>
          </div>
          <button className="flex items-center gap-1 text-[11px] font-medium text-[var(--accent-blue)] hover:text-indigo-400 bg-[rgba(99,102,241,0.1)] px-2 py-1 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Task
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {mockTasks.map((task, i) => (
            <div key={i} className={`p-3 rounded-xl cursor-pointer transition-colors ${task.active ? 'bg-[var(--bg-card)] border border-[var(--border-subtle)]' : 'hover:bg-[var(--bg-hover)] border border-transparent'}`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${task.active ? 'text-white' : 'text-gray-300'}`}>{task.title}</span>
                <span className="text-[10px] text-gray-500">{task.time}</span>
              </div>
              <p className="text-[11px] text-gray-400">{task.tags}</p>
            </div>
          ))}
          <button className="w-full text-left px-3 py-2 mt-2 text-xs text-gray-400 hover:text-gray-200 transition-colors flex justify-between items-center">
            View all tasks
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Knowledge Base (RAG) */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2 text-gray-300 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Internal Knowledge Base (RAG)</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          
          <div className="space-y-3">
            {mockRags.map((rag, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-300">{rag.title}</p>
                    <p className="text-[10px] text-gray-500">{rag.count}</p>
                  </div>
                </div>
                {/* Toggle switch */}
                <div className={`w-7 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${rag.active ? 'bg-[var(--accent-blue)]' : 'bg-[var(--bg-hover)]'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${rag.active ? 'transform translate-x-3' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Status */}
        <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.05)] text-[var(--accent-green)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">Status: Air-Gapped</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
