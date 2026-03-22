export interface Place {
  id: string
  name: string
  address: string
  totalArea?: number
  totalAreaSqFt?: number
  spaces?: number
  units?: number
  buildings?: number
  status?: 'available' | 'maintenance' | string
  capacityPercentage?: number
  imageUrl?: string
  image?: string
}

export interface PlacesResponse {
  data?: Place[]
  places?: Place[]
  total?: number
}
