import { api } from './api'

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

export async function createReservation(
  body: CreateReservationBody,
): Promise<Reservation> {
  const { data } = await api.post<{ data: Reservation }>('/reservations', body)
  return data.data
}
