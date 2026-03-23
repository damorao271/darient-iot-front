export interface CreateReservationBody {
  spaceId: string
  clientEmail: string
  reservationDate: string
  startTime: string
  endTime: string
}

export interface Reservation {
  id: string
}

export interface ReservationListItem {
  id: string
  spaceId: string
  placeId: string
  clientEmail: string
  startAt: string
  endAt: string
  createdAt: string
  updatedAt: string
  reservationDate: string
  timezone: string
}

export interface ReservationsMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface FetchReservationsParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  spaceId?: string
  fromDate?: string
  toDate?: string
  clientEmail?: string
  /** Incremented on each Search click to force refetch with same params */
  searchTrigger?: number
}

export interface ReservationsListResponse {
  items: ReservationListItem[]
  meta: ReservationsMeta
}
