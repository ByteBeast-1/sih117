import { useState, useEffect } from 'react'
import { Activity, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react'

export default function TelemetryHUD() {
  const [data, setData] = useState({
    pressure: 11.2,
    temp: 342,
    flow: 450,
  })

  // Simulate live sensor fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        pressure: +(prev.pressure + (Math.random() * 0.2 - 0.1)).toFixed(2),
        temp: +(prev.temp + (Math.random() * 2 - 1)).toFixed(1),
        flow: +(prev.flow + (Math.random() * 10 - 5)).toFixed(0),
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-sovereign-400">
          <Activity className="w-5 h-5" />
          CDU-1 Live Telemetry
        </h2>
        <div className="flex items-center gap-2 text-xs bg-success/10 text-success px-2 py-1 rounded-full border border-success/20">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
          Sensors Online
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pressure */}
        <div className="card-surface p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Wind className="w-4 h-4" /> Column Pressure (PT-301)
          </div>
          <div className="text-3xl font-bold font-mono text-slate-100">{data.pressure} <span className="text-base text-slate-500">MPa</span></div>
          {data.pressure > 11.8 && (
            <div className="mt-2 text-xs text-warning flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Approaching limit (12 MPa)
            </div>
          )}
        </div>

        {/* Temperature */}
        <div className="card-surface p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Thermometer className="w-4 h-4" /> Distillate Temp (TT-104)
          </div>
          <div className="text-3xl font-bold font-mono text-slate-100">{data.temp} <span className="text-base text-slate-500">°C</span></div>
        </div>

        {/* Flow Rate */}
        <div className="card-surface p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Droplets className="w-4 h-4" /> Feed Flow (FT-201)
          </div>
          <div className="text-3xl font-bold font-mono text-slate-100">{data.flow} <span className="text-base text-slate-500">m³/h</span></div>
        </div>
      </div>

      <div className="mt-auto p-4 bg-surface-200/50 rounded-xl border border-surface-300/30">
        <h3 className="text-sm font-medium mb-2 text-slate-300">AI Context Sync</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The AI agents automatically read this real-time telemetry when you ask questions like "Is the current pressure safe?". No need to copy-paste values.
        </p>
      </div>
    </div>
  )
}
