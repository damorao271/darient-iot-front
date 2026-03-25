/**
 * Backend API response envelope types.
 * All success responses follow ApiSuccessEnvelope; errors follow ApiErrorEnvelope.
 */

/** Backend success envelope - all 2xx responses follow this */
export interface ApiSuccessEnvelope<T> {
  success: true
  statusCode: number
  message: string
  data: T
  timestamp: string
  path: string
}

/** Validation detail from 400 responses (generic for all endpoints) */
export interface ValidationDetail {
  field: string
  issue: string
}

/** Backend error envelope - 4xx/5xx response body */
export interface ApiErrorEnvelope {
  success: false
  statusCode: number
  message: string
  error: string
  timestamp: string
  path: string
  details?: ValidationDetail[]
}

/** Paginated payload shape (when data is paginated) */
export interface PaginatedPayload<T> {
  items: T[]
  total: number
  page?: number
  limit?: number
}
