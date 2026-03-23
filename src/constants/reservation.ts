import type { CreateReservationFormInput } from '../schemas/reservation.schema'

export const CREATE_RESERVATION_DEFAULT_VALUES: CreateReservationFormInput = {
  clientEmail: '',
  reservationDate: '',
  startTime: '',
  endTime: '',
}
