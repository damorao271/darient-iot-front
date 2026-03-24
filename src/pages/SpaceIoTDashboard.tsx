import { useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSpace } from '../hooks/useSpace'
import { useTelemetry } from '../hooks/useTelemetry'
import { useAlerts } from '../hooks/useAlerts'
import { useDeviceTwin } from '../hooks/useDeviceTwin'
import { useUpdateDesired } from '../hooks/useUpdateDesired'
import { useIoTSocket } from '../hooks/useIoTSocket'
import { AppSidebar } from '../components/AppSidebar'
import { AppHeader } from '../components/AppHeader'
import { ApiErrorAlert } from '../components/ApiErrorAlert'
import { StatCard } from '../components/iot/StatCard'
import { TelemetryPanel } from '../components/iot/TelemetryPanel'
import { AlertsPanel } from '../components/iot/AlertsPanel'
import { DeviceTwinPanel } from '../components/iot/DeviceTwinPanel'
import { DesiredConfigModal } from '../components/iot/DesiredConfigModal'
import { ConnectionStatus } from '../components/iot/ConnectionStatus'
import type { Alert } from '../types/iot.types'
import { toast } from 'sonner'

export function SpaceIoTDashboard() {
  const { spaceId } = useParams<{ spaceId: string }>()
  const [connected, setConnected] = useState(false)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const { data: space, isLoading: spaceLoading, error: spaceError } = useSpace(spaceId)
  const { data: telemetryData, isLoading: telemetryLoading, error: telemetryError, refetch: refetchTelemetry } = useTelemetry(spaceId)
  const { data: alerts, isLoading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useAlerts(spaceId)
  const { data: twin, isLoading: twinLoading, error: twinError, refetch: refetchTwin } = useDeviceTwin(spaceId)
  const updateDesired = useUpdateDesired(spaceId ?? '')

  const place = space?.place

  const onAlertOpened = useCallback((alert: Alert) => {
    const labels: Record<string, string> = {
      CO2: 'High CO₂',
      OCCUPANCY_MAX: 'Over Capacity',
      OCCUPANCY_UNEXPECTED: 'Unexpected Occupancy',
    }
    toast.warning(`Alert: ${labels[alert.kind] ?? alert.kind}`, {
      description: 'A new alert has been triggered for this space.',
    })
  }, [])

  const onAlertResolved = useCallback((alert: Alert) => {
    const labels: Record<string, string> = {
      CO2: 'High CO₂',
      OCCUPANCY_MAX: 'Over Capacity',
      OCCUPANCY_UNEXPECTED: 'Unexpected Occupancy',
    }
    toast.success(`Resolved: ${labels[alert.kind] ?? alert.kind}`, {
      description: 'The alert condition has been cleared.',
    })
  }, [])

  useIoTSocket(spaceId, {
    onConnectionChange: setConnected,
    onAlertOpened,
    onAlertResolved,
  })

  const readings = telemetryData?.readings ?? []
  const stats = telemetryData?.stats

  if (spaceError) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <p className="text-slate-600">Failed to load space details.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AppSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <AppHeader />

        <div className="flex-1 overflow-auto p-6">
          {spaceLoading ? (
            <div className="max-w-7xl mx-auto animate-pulse space-y-6">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-10 bg-slate-200 rounded w-1/2" />
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-xl" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-96 bg-slate-200 rounded-xl" />
                <div className="h-96 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ) : space ? (
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs font-semibold text-violet-600 uppercase tracking-wider mb-4">
                <Link to="/" className="hover:text-violet-700">
                  Locations
                </Link>
                {place && (
                  <>
                    <span className="text-slate-400">/</span>
                    <Link
                      to={`/places/${place.id}/spaces`}
                      className="hover:text-violet-700"
                    >
                      {place.name}
                    </Link>
                  </>
                )}
                <span className="text-slate-400">/</span>
                <Link
                  to={`/spaces/${spaceId}`}
                  className="hover:text-violet-700"
                >
                  {space.name}
                </Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-700">IoT Dashboard</span>
              </nav>

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    IoT Dashboard
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {space.name} · Capacity: {space.capacity}
                    {space.openTime && space.closeTime && (
                      <> · Hours: {space.openTime} – {space.closeTime}</>
                    )}
                  </p>
                </div>
                <ConnectionStatus connected={connected} />
              </div>

              {/* Stat cards */}
              {telemetryError ? (
                <ApiErrorAlert
                  error={telemetryError}
                  onRetry={() => refetchTelemetry()}
                />
              ) : telemetryLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 animate-pulse">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  <StatCard
                    label="Temperature"
                    value={readings[0]?.tempC ?? '—'}
                    unit="°C"
                    subValue={stats ? `Avg: ${stats.avgTempC}°C (1h)` : undefined}
                    color="rose"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Humidity"
                    value={readings[0]?.humidityPct ?? '—'}
                    unit="%"
                    subValue={stats ? `Avg: ${stats.avgHumidityPct}% (1h)` : undefined}
                    color="blue"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    }
                  />
                  <StatCard
                    label="CO₂"
                    value={readings[0]?.co2Ppm ?? '—'}
                    unit="ppm"
                    subValue={stats ? `Max: ${stats.maxCo2Ppm} ppm (1h)` : undefined}
                    color="amber"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Occupancy"
                    value={readings[0]?.occupancy ?? '—'}
                    unit={`/ ${space.capacity}`}
                    subValue={stats ? `Max: ${stats.maxOccupancy} (1h)` : undefined}
                    color="violet"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Power"
                    value={readings[0]?.powerW ?? '—'}
                    unit="W"
                    subValue={stats ? `Avg: ${stats.avgPowerW}W (1h)` : undefined}
                    color="green"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    }
                  />
                </div>
              )}

              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Telemetry charts */}
                {!telemetryError && (
                  <TelemetryPanel readings={readings} />
                )}

                {/* Device Twin */}
                {twinError ? (
                  <ApiErrorAlert
                    error={twinError}
                    onRetry={() => refetchTwin()}
                  />
                ) : twinLoading ? (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-pulse p-6 space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-1/2" />
                    <div className="h-32 bg-slate-200 rounded" />
                  </div>
                ) : twin ? (
                  <DeviceTwinPanel
                    twin={twin}
                    onEditDesired={() => {
                      updateDesired.reset()
                      setIsConfigModalOpen(true)
                    }}
                  />
                ) : null}
              </div>

              {/* Alerts */}
              {alertsError ? (
                <ApiErrorAlert
                  error={alertsError}
                  onRetry={() => refetchAlerts()}
                />
              ) : (
                <AlertsPanel
                  alerts={alerts ?? []}
                  isLoading={alertsLoading}
                />
              )}
            </div>
          ) : null}
        </div>
      </main>

      {twin && (
        <DesiredConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onSubmit={(body) => {
            updateDesired.mutate(body, {
              onSuccess: () => setIsConfigModalOpen(false),
            })
          }}
          current={twin.desired}
          isSubmitting={updateDesired.isPending}
          error={updateDesired.error}
        />
      )}
    </div>
  )
}
