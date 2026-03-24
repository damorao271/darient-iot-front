interface ConnectionStatusProps {
  connected: boolean
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
      <span
        className={`w-2 h-2 rounded-full ${
          connected
            ? 'bg-emerald-500 animate-pulse'
            : 'bg-slate-400'
        }`}
      />
      <span className="text-xs font-medium text-slate-600">
        {connected ? 'Live' : 'Connecting...'}
      </span>
    </div>
  )
}
