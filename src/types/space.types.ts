import type { Reservation } from './reservation.types'

export interface Space {
  id?: string
  placeId: string
  name: string
  reference?: string | null
  capacity: number
  description?: string | null
  reservations?: Reservation[]
  createdAt?: string
  updatedAt?: string
}
