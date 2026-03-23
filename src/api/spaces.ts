import { api } from './api'
import type {
  PlaceSpacesResponse,
  Space,
  SpaceSortBy,
  SortOrder,
} from '../types/spaces.types'
import type { CreateSpaceFormValues } from '../schemas/space.schema'

export interface CreateSpaceBody extends CreateSpaceFormValues {
  placeId: string
}

export interface FetchPlaceSpacesParams {
  page?: number
  pageSize?: number
  sortBy?: SpaceSortBy
  sortOrder?: SortOrder
}

export interface PlaceSpacesData {
  place: PlaceSpacesResponse['data']['place']
  spaces: Space[]
  total: number
}

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

export interface UpdateSpaceBody extends CreateSpaceFormValues {}

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

export interface SpaceDetailResponse {
  data: Space & { place?: { id: string; name: string; timezone?: string } }
}

export async function fetchSpaceById(spaceId: string): Promise<
  Space & { place?: { id: string; name: string; timezone?: string } }
> {
  const { data } = await api.get<SpaceDetailResponse>(`/spaces/${spaceId}`)
  return data.data
}
