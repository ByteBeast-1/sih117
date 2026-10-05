import { useState } from 'react'
import { Sliders, Zap, AlertTriangle, Cpu, Gauge } from 'lucide-react'

export default function WhatIfSimulator() {
  const [temp, setTemp] = useState(340)
  const [pressure, setPressure] = useState(11.2)
  const [isSimulating, setIsSimulating] = useState(false)
  const [result, setResult] = useState(null)

  const handleSimulate = () => {
    setIsSimulating(true)
    // Mock simulation delay
    setTimeout(() => {
      setIsSimulating(false)
      if (temp > 355 || pressure > 12.5) {
        setResult({
          status: 'danger',
          message: 'SOP Violation: T-104 exceedance predicted. Downstream yield drops by 14%.',
        })
      } else {
        setResult({
          status: 'safe',
          message: 'Parameters within safe limits. Predicted yield increase: +2.1%.',
        })
      }
    }, 1500)
  }

  return (
    <div className="p-5 h-full flex flex-col overflow-y-auto bg-[#131314] rounded-xl border border-surface-300/50 relative shadow-2xl">
      
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none rounded-xl" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Sliders className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">What-If Scenario</h2>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className={`w-4 h-4 ${isSimulating ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-[10px] uppercase tracking-widest text-slate-500">{isSimulating ? 'Computing' : 'Standby'}</span>
        </div>
      </div>

      <div className="space-y-5 relative z-10">
        {/* Sliders */}
        <div className="bg-[#1a1a1c] border border-surface-300/60 rounded-xl p-5 shadow-inner">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-4 tracking-wide uppercase">
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-orange-400" />
              Distillate Temperature (°C)
            </div>
            <div className="text-orange-400 font-mono bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{temp}°</div>
          </label>
          <input
            type="range"
            min="300" max="380" step="1"
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full h-1.5 bg-surface-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
            <span>300</span>
            <span>380</span>
          </div>
        </div>

        <div className="bg-[#1a1a1c] border border-surface-300/60 rounded-xl p-5 shadow-inner">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-4 tracking-wide uppercase">
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              Column Pressure (MPa)
            </div>
            <div className="text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{pressure}</div>
          </label>
          <input
            type="range"
            min="8.0" max="14.0" step="0.1"
            value={pressure}
            onChange={(e) => setPressure(Number(e.target.value))}
            className="w-full h-1.5 bg-surface-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
            <span>8.0</span>
            <span>14.0</span>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="animate-pulse">Processing Neural Network...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" /> Run Simulation Prediction
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className={`p-4 rounded-xl border animate-fade-in relative overflow-hidden ${
            result.status === 'safe' 
              ? 'bg-emerald-950/30 border-emerald-500/40' 
              : 'bg-rose-950/30 border-rose-500/40'
          }`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${result.status === 'safe' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <div className="flex items-start gap-3 pl-2">
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${result.status === 'safe' ? 'text-emerald-400' : 'text-rose-400'}`} />
              <div>
                <h4 className={`font-semibold text-sm mb-1 uppercase tracking-widest ${result.status === 'safe' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.status === 'safe' ? 'Simulation Safe' : 'Simulation Warning'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">{result.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
