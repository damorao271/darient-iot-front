import type { TelemetryReading } from '../../types/iot.types'
import { TelemetryChart } from './TelemetryChart'
import { METRICS } from './TelemetryPanel.constants'

interface TelemetryPanelProps {
  readings: TelemetryReading[]
}

export function TelemetryPanel({ readings }: TelemetryPanelProps) {
  const latest = readings[0]

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Telemetry Trends</h2>
        <span className="text-xs text-slate-500">
          {readings.length} readings
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {METRICS.map((metric) => (
          <div key={metric.key} className="px-5 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-600">
                {metric.label}
              </span>
              {latest && (
                <span className="text-sm font-semibold text-slate-900">
                  {latest[metric.key]}
                  {metric.unit && (
                    <span className="text-xs font-normal text-slate-400 ml-0.5">
                      {metric.unit}
                    </span>
                  )}
                </span>
              )}
            </div>
            <TelemetryChart
              readings={readings}
              dataKey={metric.key}
              color={metric.color}
              height={48}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
