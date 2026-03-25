import { useQuery } from '@tanstack/react-query'
import { fetchTelemetry } from '../api/iot'
import { queryKeys } from '../api/query-keys'

export function useTelemetry(spaceId: string | undefined, limit = 50) {
  return useQuery({
    queryKey: queryKeys.iot.telemetry(spaceId ?? ''),
    queryFn: () => fetchTelemetry(spaceId!, limit),
    enabled: !!spaceId,
    refetchInterval: 30_000,
  })
}
