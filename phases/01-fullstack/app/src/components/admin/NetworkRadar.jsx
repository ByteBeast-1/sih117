import { Shield, Radio, WifiOff } from 'lucide-react'

export default function NetworkRadar() {
  return (
    <div className="card-surface p-5 h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Radar sweeping background effect */}
      <div className="absolute inset-0 border-4 border-success/10 rounded-full w-[150%] h-[150%] top-[-25%] left-[-25%] pointer-events-none opacity-20 animate-spin" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-0 border-4 border-success/20 rounded-full w-[100%] h-[100%] pointer-events-none opacity-20 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-success/10 border-2 border-success/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <WifiOff className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-3xl font-black text-success font-mono mb-1">0 BYTES</h2>
        <p className="text-sm text-success/80 font-medium tracking-widest uppercase mb-4">Outbound Traffic</p>
        
        <div className="bg-success/10 border border-success/20 rounded-lg px-4 py-3 flex items-start gap-3 w-full max-w-xs">
          <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div className="text-xs text-success/90">
            <p className="font-bold mb-1">Sovereign Mode Active</p>
            <p>Physical network interface disabled. No data can leave the premises.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
