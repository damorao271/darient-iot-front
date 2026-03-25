import type { DeviceTwin } from '../../types/iot.types'

interface DeviceTwinPanelProps {
  twin: DeviceTwin
  onEditDesired: () => void
}

function TwinRow({
  label,
  desired,
  reported,
  unit,
}: {
  label: string
  desired: string | number | null | undefined
  reported: string | number | null | undefined
  unit?: string
}) {
  const inSync =
    desired != null && reported != null && String(desired) === String(reported)
  const hasBoth = desired != null && reported != null

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-3 pr-3 text-sm font-medium text-slate-700">{label}</td>
      <td className="py-3 px-3 text-sm text-slate-900 text-center">
        {desired != null ? (
          <>
            {desired}
            {unit && <span className="text-slate-400 ml-0.5">{unit}</span>}
          </>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
      <td className="py-3 px-3 text-sm text-slate-900 text-center">
        {reported != null ? (
          <>
            {reported}
            {unit && <span className="text-slate-400 ml-0.5">{unit}</span>}
          </>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
      <td className="py-3 pl-3 text-center">
        {hasBoth ? (
          inSync ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Synced
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01" />
              </svg>
              Pending
            </span>
          )
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
    </tr>
  )
}

export function DeviceTwinPanel({ twin, onEditDesired }: DeviceTwinPanelProps) {
  const { desired, reported } = twin

  const lastReportedTime = reported?.ts
    ? new Date(reported.ts).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Digital Twin</h2>
          {lastReportedTime && (
            <p className="text-xs text-slate-500 mt-0.5">
              Last report: {lastReportedTime}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onEditDesired}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Configure
        </button>
      </div>

      <div className="px-5 py-3">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Property
              </th>
              <th className="py-2 px-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Desired
              </th>
              <th className="py-2 px-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Reported
              </th>
              <th className="py-2 pl-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <TwinRow
              label="CO₂ Threshold"
              desired={desired?.co2AlertThreshold}
              reported={reported?.co2AlertThreshold}
              unit="ppm"
            />
            <TwinRow
              label="Sampling Interval"
              desired={desired?.samplingIntervalSec}
              reported={reported?.samplingIntervalSec}
              unit="s"
            />
            <TwinRow
              label="Firmware"
              desired={null}
              reported={reported?.firmwareVersion}
            />
          </tbody>
        </table>
      </div>

      {!desired && !reported && (
        <div className="px-5 pb-4">
          <p className="text-sm text-slate-500 text-center py-4">
            No device data yet. Configure desired settings to get started.
          </p>
        </div>
      )}
    </div>
  )
}
