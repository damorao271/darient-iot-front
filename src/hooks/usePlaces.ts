import { useQuery } from '@tanstack/react-query'
import { fetchPlaces } from '../api/places'
import { queryKeys } from '../api/query-keys'

export function usePlaces(page = 1, limit = 12) {
  return useQuery({
    queryKey: queryKeys.places.list(page, limit),
    queryFn: () => fetchPlaces({ page, limit }),
  })
}
