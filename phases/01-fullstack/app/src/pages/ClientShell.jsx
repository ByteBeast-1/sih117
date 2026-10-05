import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Client Shell — 4-Pane layout wrapper
export default function ClientShell() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
      {/* Sidebar contains Far Left and Mid Left panels */}
      <Sidebar />
      
      {/* Main content area (Outlet) will contain Center and Right panels */}
      <div className="flex-1 flex min-w-0 h-full">
        <Outlet />
      </div>
    </div>
  );
}
