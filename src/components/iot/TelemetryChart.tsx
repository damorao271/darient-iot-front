import { useMemo } from 'react'
import type { TelemetryReading } from '../../types/iot.types'

interface TelemetryChartProps {
  readings: TelemetryReading[]
  dataKey: keyof Pick<TelemetryReading, 'tempC' | 'humidityPct' | 'co2Ppm' | 'occupancy' | 'powerW'>
  color: string
  height?: number
}

export function TelemetryChart({
  readings,
  dataKey,
  color,
  height = 80,
}: TelemetryChartProps) {
  const points = useMemo(() => {
    const sorted = [...readings].sort(
      (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime(),
    )
    if (sorted.length === 0) return []

    const values = sorted.map((r) => r[dataKey] as number)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    return sorted.map((r, i) => ({
      x: (i / Math.max(sorted.length - 1, 1)) * 100,
      y: height - 8 - ((((r[dataKey] as number) - min) / range) * (height - 16)),
    }))
  }, [readings, dataKey, height])

  if (points.length < 2) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-xs text-slate-400"
      >
        Waiting for data...
      </div>
    )
  }

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
    >
      <defs>
        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${dataKey})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
