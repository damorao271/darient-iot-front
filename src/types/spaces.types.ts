import type { CreateSpaceFormValues } from '../schemas/space.schema'

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
  openTime?: string | null
  closeTime?: string | null
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
  totalSpaces?: number
}

export interface PlaceSpacesMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  sortBy: string
  sortOrder: string
}

export interface PlaceSpacesResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    place: PlaceSpacesPlace
    items: Space[]
    meta: PlaceSpacesMeta
  }
  timestamp: string
  path: string
}

export type SpaceSortBy = 'name' | 'capacity'
export type SortOrder = 'asc' | 'desc'

// API params, request bodies & response shapes
export interface FetchPlaceSpacesParams {
  page?: number
  pageSize?: number
  sortBy?: SpaceSortBy
  sortOrder?: SortOrder
}

export interface CreateSpaceBody extends CreateSpaceFormValues {
  placeId: string
}

export interface UpdateSpaceBody extends CreateSpaceFormValues {}

export interface PlaceSpacesData {
  place: PlaceSpacesPlace
  spaces: Space[]
  total: number
}

export interface SpaceDetailPlace {
  id: string
  name: string
  timezone?: string
  latitude?: number
  longitude?: number
}

export interface SpaceDetailResponse {
  data: Space & { place?: SpaceDetailPlace }
}
