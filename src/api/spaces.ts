import { api } from './api'
import type { PlaceSpacesResponse, Space } from '../types/spaces.types'

export interface PlaceSpacesData {
  place: PlaceSpacesResponse['data']['place']
  spaces: Space[]
}

export async function fetchPlaceSpaces(placeId: string): Promise<PlaceSpacesData> {
  const { data } = await api.get<PlaceSpacesResponse>(`/places/${placeId}/spaces`)
  return {
    place: data.data.place,
    spaces: data.data.spaces ?? [],
  }
}
