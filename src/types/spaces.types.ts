export interface Reservation {
  id: string
  clientEmail: string
  startAt: string
  endAt: string
  createdAt: string
  updatedAt: string
}

export interface Space {
  id: string
  name: string
  reference: string
  capacity: number
  description: string
  createdAt: string
  updatedAt: string
  reservations: Reservation[]
}

export interface PlaceSpacesPlace {
  id: string
  name: string
  latitude: number
  longitude: number
  timezone: string
  createdAt: string
  updatedAt: string
}

export interface PlaceSpacesResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    place: PlaceSpacesPlace
    spaces: Space[]
  }
  timestamp: string
  path: string
}
