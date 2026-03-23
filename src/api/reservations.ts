import { api } from './api'
import type {
  CreateReservationBody,
  UpdateReservationBody,
  Reservation,
  ReservationsListResponse,
  FetchReservationsParams,
} from '../types/reservation.types'

export async function createReservation(
  body: CreateReservationBody,
): Promise<Reservation> {
  const { data } = await api.post<{ data: Reservation }>('/reservations', body)
  return data.data
}

export async function fetchReservations(
  params: FetchReservationsParams,
): Promise<ReservationsListResponse> {
  const { data } = await api.get<{
    success: boolean
    data: ReservationsListResponse
  }>('/reservations', { params })
  return data.data
}

export async function updateReservation(
  reservationId: string,
  body: UpdateReservationBody,
): Promise<Reservation> {
  const { data } = await api.patch<{ data: Reservation }>(
    `/reservations/${reservationId}`,
    body,
  )
  return data.data
}

export async function cancelReservation(reservationId: string): Promise<void> {
  await api.delete(`/reservations/${reservationId}`)
}
