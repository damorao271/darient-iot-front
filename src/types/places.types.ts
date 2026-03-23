import type { Space } from './space.types'

export interface Place {
  id: string
  name: string
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
