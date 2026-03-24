import { colorMap } from './StatCard.constants'
import type { StatCardProps } from './StatCard.types'

export function StatCard({
  label,
  value,
  unit,
  subValue,
  icon,
  color,
}: StatCardProps) {
  const c = colorMap[color]

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${c.bg} ring-1 ${c.ring} flex items-center justify-center shrink-0`}
        >
          <span className={c.icon}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">
            {value}
            {unit && (
              <span className="text-sm font-normal text-slate-400 ml-1">
                {unit}
              </span>
            )}
          </p>
          {subValue && (
            <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  )
}
