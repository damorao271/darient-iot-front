import { api } from './api'
import type { Place, PlacesResponse } from '../types/places.types'

export interface FetchPlacesParams {
  page?: number
  limit?: number
}

export async function fetchPlaces(
  params: FetchPlacesParams = {}
): Promise<{ places: Place[]; total: number }> {
  const { page = 1, limit = 12 } = params
  const { data } = await api.get<Place[] | PlacesResponse>('/places', {
    params: { page, limit },
  })

  let places: Place[] = []
  let total = 0

  if (Array.isArray(data)) {
    places = data
    total = data.length
  } else if (data && typeof data === 'object') {
    const res = data as PlacesResponse
    places = res.data ?? res.places ?? []
    total = res.total ?? places.length
  }

  return { places, total }
}
