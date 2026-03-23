import { useQuery } from '@tanstack/react-query'
import { fetchPlaceSpaces } from '../api/spaces'
import type { FetchPlaceSpacesParams } from '../types/spaces.types'
import { queryKeys } from '../api/query-keys'

export function usePlaceSpaces(
  placeId: string | undefined,
  params: FetchPlaceSpacesParams = {},
) {
  const { page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'asc' } = params
  return useQuery({
    queryKey: queryKeys.places.spaces(
      placeId ?? '',
      page,
      pageSize,
      sortBy,
      sortOrder,
    ),
    queryFn: () =>
      fetchPlaceSpaces(placeId!, { page, pageSize, sortBy, sortOrder }),
    enabled: !!placeId,
  })
}
