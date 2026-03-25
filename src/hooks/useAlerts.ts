import { useQuery } from '@tanstack/react-query'
import { fetchAlerts } from '../api/iot'
import { queryKeys } from '../api/query-keys'

export function useAlerts(
  spaceId: string | undefined,
  status: 'open' | 'all' = 'all',
  limit = 50,
) {
  return useQuery({
    queryKey: queryKeys.iot.alerts(spaceId ?? '', status),
    queryFn: () => fetchAlerts(spaceId!, status, limit),
    enabled: !!spaceId,
    refetchInterval: 30_000,
  })
}
