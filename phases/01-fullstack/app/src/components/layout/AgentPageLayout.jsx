import ClientSidebar from './ClientSidebar'

/**
 * AgentPageLayout — shared wrapper for all agent pages.
 * Renders the ClientSidebar on the left and the agent content on the right.
 * Keeps every agent page visually consistent.
 */
export default function AgentPageLayout({ children }) {
  return (
    <div className="flex h-screen bg-surface-100 text-slate-100 overflow-hidden font-sans">
      <ClientSidebar />
      <div className="flex-1 flex flex-col relative bg-surface-100 border-x border-surface-300/50 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
