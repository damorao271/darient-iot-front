import { client } from './client'
import type { FetchPlacesParams, Place } from '../types/places.types'

export async function fetchPlaces(
  params: FetchPlacesParams = {},
): Promise<{ places: Place[]; total: number }> {
  const { page = 1, limit = 12 } = params
  const places = await client.get<Place[]>('/places', {
    params: { page, limit },
  })
  const list = Array.isArray(places) ? places : []
  const total = list.length < limit ? (page - 1) * limit + list.length : page * limit
  return { places: list, total }
}
