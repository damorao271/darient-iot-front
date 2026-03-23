import { useQuery } from '@tanstack/react-query'
import { fetchSpaceById } from '../api/spaces'
import { queryKeys } from '../api/query-keys'

export function useSpace(spaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.spaces.detail(spaceId ?? ''),
    queryFn: () => fetchSpaceById(spaceId!),
    enabled: !!spaceId,
  })
}
