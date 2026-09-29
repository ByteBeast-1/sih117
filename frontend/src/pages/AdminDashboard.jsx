import { useState, useContext } from 'react';
import { AuthContext } from '../App';
import AdminSidebar from '../components/admin/AdminSidebar';
import DocsViewer from '../components/admin/DocsViewer';
import FeaturesArchitecture from '../components/admin/FeaturesArchitecture';
import ModelMonitor from '../components/admin/ModelMonitor';
import FileManager from '../components/admin/FileManager';
import ClientMonitor from '../components/admin/ClientMonitor';
import SystemLogs from '../components/admin/SystemLogs';

/**
 * AdminDashboard — docs-style 2-pane layout.
 * Left: AdminSidebar with grouped navigation.
 * Right: Content panel that swaps based on selected section.
 * Design: dark theme, 2 shades of gray, professional, no fancy icons.
 */
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('docs-guide');
  const { logout } = useContext(AuthContext);

  // Map sidebar IDs to content components
  const renderContent = () => {
    switch (activeSection) {
      case 'docs-guide':
      case 'docs-setup':
      case 'docs-config':
        return <DocsViewer subPage={activeSection} />;
      case 'features':
        return <FeaturesArchitecture />;
      case 'models':
        return <ModelMonitor />;
      case 'files':
        return <FileManager />;
      case 'clients':
        return <ClientMonitor />;
      case 'logs':
        return <SystemLogs />;
      default:
        return <DocsViewer subPage="docs-guide" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d0d' }}>
      {/* Left sidebar */}
      <AdminSidebar activeSection={activeSection} onSelect={setActiveSection} />

      {/* Right content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ background: '#0d0d0d', borderColor: '#1e1e1e' }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-medium text-white">Admin Console</h1>
            <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: '#1e1e1e', color: '#666' }}>
              v0.1.0-prototype
            </span>
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-md transition-colors"
            style={{ color: '#999', border: '1px solid #2a2a2a' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >
            Logout
          </button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
