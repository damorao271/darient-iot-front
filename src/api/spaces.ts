import { api } from './api'
import type {
  CreateSpaceBody,
  FetchPlaceSpacesParams,
  PlaceSpacesData,
  PlaceSpacesResponse,
  Space,
  SpaceDetailPlace,
  SpaceDetailResponse,
  UpdateSpaceBody,
} from '../types/spaces.types'

export async function fetchPlaceSpaces(
  placeId: string,
  params: FetchPlaceSpacesParams = {},
): Promise<PlaceSpacesData> {
  const { page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'asc' } = params
  const { data } = await api.get<PlaceSpacesResponse>(
    `/places/${placeId}/spaces`,
    { params: { page, pageSize, sortBy, sortOrder } },
  )
  const spaces = data.data.items ?? []
  const total = data.data.meta?.total ?? spaces.length
  return {
    place: data.data.place,
    spaces,
    total,
  }
}

export async function createSpace(body: CreateSpaceBody): Promise<Space> {
  const { data } = await api.post<{ data: Space }>('/spaces', body)
  return data.data
}

export async function updateSpace(
  spaceId: string,
  body: UpdateSpaceBody,
): Promise<Space> {
  const { data } = await api.patch<{ data: Space }>(`/spaces/${spaceId}`, body)
  return data.data
}

export async function deleteSpace(spaceId: string): Promise<void> {
  await api.delete(`/spaces/${spaceId}`)
}

export async function fetchSpaceById(spaceId: string): Promise<
  Space & { place?: SpaceDetailPlace }
> {
  const { data } = await api.get<SpaceDetailResponse>(`/spaces/${spaceId}`)
  return data.data
}
