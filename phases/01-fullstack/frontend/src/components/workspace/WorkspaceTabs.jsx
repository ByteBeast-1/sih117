import { useState } from 'react'
import { Activity, Image as ImageIcon, Sliders, TerminalSquare } from 'lucide-react'
import TelemetryHUD from './TelemetryHUD'
import BlueprintViewer from './BlueprintViewer'
import WhatIfSimulator from './WhatIfSimulator'
import SandboxTerminal from './SandboxTerminal'

export default function WorkspaceTabs() {
  const [activeTab, setActiveTab] = useState('telemetry')

  const tabs = [
    { id: 'telemetry', label: 'Telemetry HUD', icon: Activity },
    { id: 'blueprint', label: 'P&ID Blueprint', icon: ImageIcon },
    { id: 'whatif', label: 'What-If Simulator', icon: Sliders },
    { id: 'sandbox', label: 'Sandbox Terminal', icon: TerminalSquare },
  ]

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-50 border-r border-surface-300/50 relative hidden lg:flex">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-2 border-b border-surface-300/50 bg-surface-100">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-surface-300 text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Active Tab Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'telemetry' && <TelemetryHUD />}
        {activeTab === 'blueprint' && <BlueprintViewer />}
        {activeTab === 'whatif' && <WhatIfSimulator />}
        {activeTab === 'sandbox' && <SandboxTerminal />}
      </div>
    </div>
  )
}
