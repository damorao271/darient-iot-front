import { useState } from 'react'
import type { Alert, AlertKind } from '../../types/iot.types'

interface AlertsPanelProps {
  alerts: Alert[]
  isLoading: boolean
}

const ALERT_CONFIG: Record<
  AlertKind,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  CO2: {
    label: 'High CO₂',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  OCCUPANCY_MAX: {
    label: 'Over Capacity',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  OCCUPANCY_UNEXPECTED: {
    label: 'Unexpected Occupancy',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50 border-violet-200',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
}

function formatAlertTime(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function getAlertDuration(startedAt: string, resolvedAt: string | null): string {
  const start = new Date(startedAt).getTime()
  const end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now()
  const diffMs = end - start
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

export function AlertsPanel({ alerts, isLoading }: AlertsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')

  const filtered = alerts.filter((a) => {
    if (filter === 'active') return !a.resolvedAt
    if (filter === 'resolved') return !!a.resolvedAt
    return true
  })

  const activeCount = alerts.filter((a) => !a.resolvedAt).length

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-slate-900">Alerts</h2>
            {activeCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                {activeCount} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {(['all', 'active', 'resolved'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="animate-pulse p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <svg className="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-500">
              {filter === 'active'
                ? 'No active alerts'
                : filter === 'resolved'
                  ? 'No resolved alerts'
                  : 'No alerts recorded'}
            </p>
          </div>
        ) : (
          filtered.map((alert) => {
            const config = ALERT_CONFIG[alert.kind]
            const isOpen = !alert.resolvedAt
            return (
              <div
                key={alert.id}
                className={`px-5 py-3 flex items-start gap-3 ${
                  isOpen ? 'bg-red-50/30' : ''
                }`}
              >
                <div
                  className={`mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${config.bgColor}`}
                >
                  <span className={config.color}>{config.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${config.color}`}>
                      {config.label}
                    </span>
                    {isOpen ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Started {formatAlertTime(alert.startedAt)}
                    {alert.resolvedAt && (
                      <> · Resolved {formatAlertTime(alert.resolvedAt)}</>
                    )}
                    <span className="text-slate-400">
                      {' '}
                      · Duration: {getAlertDuration(alert.startedAt, alert.resolvedAt)}
                    </span>
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
