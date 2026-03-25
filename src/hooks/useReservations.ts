import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchReservations } from '../api/reservations'
import type { FetchReservationsParams } from '../types/reservation.types'
import { queryKeys } from '../api/query-keys'

export function useReservations(params: FetchReservationsParams) {
  const {
    spaceId,
    page = 1,
    pageSize = 10,
    sortBy = 'startAt',
    sortOrder = 'desc',
    fromDate,
    toDate,
    clientEmail,
    searchTrigger,
  } = params

  return useQuery({
    queryKey: queryKeys.reservations.list(
      spaceId,
      page,
      pageSize,
      sortBy,
      sortOrder,
      fromDate,
      toDate,
      clientEmail,
      searchTrigger,
    ),
    queryFn: () =>
      fetchReservations({
        page,
        pageSize,
        sortBy,
        sortOrder,
        spaceId,
        fromDate,
        toDate,
        clientEmail,
      }),
    enabled: !!spaceId,
    placeholderData: keepPreviousData,
  })
}
