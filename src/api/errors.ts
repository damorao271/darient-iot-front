import type { ApiErrorEnvelope } from '../types/api.types'

export class ApiError extends Error {
  readonly statusCode: number
  readonly backendError: string
  readonly path: string
  readonly timestamp: string

  readonly cause?: unknown

  constructor(envelope: ApiErrorEnvelope, cause?: unknown) {
    super(envelope.message)
    this.cause = cause
    this.name = 'ApiError'
    this.statusCode = envelope.statusCode
    this.backendError = envelope.error
    this.path = envelope.path
    this.timestamp = envelope.timestamp
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500
  }

  isServerError(): boolean {
    return this.statusCode >= 500
  }

  isValidationError(): boolean {
    return this.statusCode === 400
  }
}
