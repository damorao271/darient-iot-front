import type { SpaceSortBy } from '../types/spaces.types'

export const SPACE_PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const

export const SPACE_SORT_BY_OPTIONS: { value: SpaceSortBy; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'capacity', label: 'Capacity' },
]
