import { useQuery } from '@tanstack/react-query'
import { fetchPlaceSpaces } from '../api/spaces'
import { queryKeys } from '../api/query-keys'

export function usePlaceSpaces(placeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.places.spaces(placeId ?? ''),
    queryFn: () => fetchPlaceSpaces(placeId!),
    enabled: !!placeId,
  })
}
