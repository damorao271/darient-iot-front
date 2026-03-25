import { api } from './api'
import type {
  TelemetryResponse,
  Alert,
  DeviceTwin,
  DeviceDesired,
  UpdateDesiredBody,
} from '../types/iot.types'

export async function fetchTelemetry(
  spaceId: string,
  limit = 50,
): Promise<TelemetryResponse> {
  const { data } = await api.get<{ data: TelemetryResponse }>(
    `/spaces/${spaceId}/telemetry`,
    { params: { limit } },
  )
  return data.data
}

export async function fetchAlerts(
  spaceId: string,
  status: 'open' | 'all' = 'all',
  limit = 50,
): Promise<Alert[]> {
  const { data } = await api.get<{ data: Alert[] }>(
    `/spaces/${spaceId}/alerts`,
    { params: { status, limit } },
  )
  return data.data
}

export async function fetchDeviceTwin(spaceId: string): Promise<DeviceTwin> {
  const { data } = await api.get<{ data: DeviceTwin }>(
    `/spaces/${spaceId}/device`,
  )
  return data.data
}

export async function updateDesiredConfig(
  spaceId: string,
  body: UpdateDesiredBody,
): Promise<DeviceDesired> {
  const { data } = await api.patch<{ data: DeviceDesired }>(
    `/spaces/${spaceId}/device/desired`,
    body,
  )
  return data.data
}
