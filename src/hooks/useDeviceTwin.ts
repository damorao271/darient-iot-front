import { useQuery } from '@tanstack/react-query'
import { fetchDeviceTwin } from '../api/iot'
import { queryKeys } from '../api/query-keys'

export function useDeviceTwin(spaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.iot.device(spaceId ?? ''),
    queryFn: () => fetchDeviceTwin(spaceId!),
    enabled: !!spaceId,
    refetchInterval: 30_000,
  })
}
