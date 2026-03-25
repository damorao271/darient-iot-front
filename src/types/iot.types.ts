export interface TelemetryReading {
  id: string
  spaceId: string
  ts: string
  tempC: number
  humidityPct: number
  co2Ppm: number
  occupancy: number
  powerW: number
}

export interface TelemetryStats {
  sampleCount: number
  avgTempC: number
  avgHumidityPct: number
  avgCo2Ppm: number
  maxCo2Ppm: number
  avgOccupancy: number
  maxOccupancy: number
  avgPowerW: number
}

export interface TelemetryResponse {
  readings: TelemetryReading[]
  stats: TelemetryStats | null
}

export type AlertKind = 'CO2' | 'OCCUPANCY_MAX' | 'OCCUPANCY_UNEXPECTED'

export interface Alert {
  id: string
  spaceId: string
  kind: AlertKind
  startedAt: string
  resolvedAt: string | null
  metaJson: Record<string, unknown> | null
}

export interface DeviceDesired {
  id: string
  spaceId: string
  co2AlertThreshold: number
  samplingIntervalSec: number
  updatedAt: string
}

export interface DeviceReported {
  id: string
  spaceId: string
  samplingIntervalSec: number
  co2AlertThreshold: number
  firmwareVersion: string
  ts: string
}

export interface DeviceTwin {
  desired: DeviceDesired | null
  reported: DeviceReported | null
}

export interface UpdateDesiredBody {
  co2AlertThreshold?: number
  samplingIntervalSec?: number
}
