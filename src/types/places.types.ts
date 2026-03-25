import type { Space } from './space.types'

export interface FetchPlacesParams {
  page?: number
  limit?: number
}

export interface Place {
  id: string
  name: string
  /** Optional URL from API; when absent, a static image is chosen from /public/places/ */
  imageUrl?: string
  latitude?: number
  longitude?: number
  timezone?: string
  createdAt?: string
  updatedAt?: string
  spaceCount?: number
  totalCapacity?: number
  spaces?: Space[]
}

export interface PlacesResponse {
  data?: Place[]
  places?: Place[]
  total?: number
}
