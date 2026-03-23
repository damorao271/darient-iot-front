import { api } from './api'
import type { PlaceSpacesResponse, Space } from '../types/spaces.types'
import type { CreateSpaceFormValues } from '../schemas/space.schema'

export interface CreateSpaceBody extends CreateSpaceFormValues {
  placeId: string
}

export interface PlaceSpacesData {
  place: PlaceSpacesResponse['data']['place']
  spaces: Space[]
}

export async function fetchPlaceSpaces(
  placeId: string,
): Promise<PlaceSpacesData> {
  const { data } = await api.get<PlaceSpacesResponse>(
    `/places/${placeId}/spaces`,
  )
  return {
    place: data.data.place,
    spaces: data.data.spaces ?? [],
  }
}

export async function createSpace(body: CreateSpaceBody): Promise<Space> {
  const { data } = await api.post<{ data: Space }>('/spaces', body)
  return data.data
}
