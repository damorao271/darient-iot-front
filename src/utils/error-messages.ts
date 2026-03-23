import { ApiError } from '../api/errors'

/**
 * Maps API and network errors to user-friendly messages.
 * Use in both inline error UI and toasts for consistent feedback.
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) return 'Session expired. Please log in again.'
    if (error.statusCode === 403)
      return "You don't have permission to perform this action."
    if (error.statusCode === 404)
      return 'The space was not found. It may have already been deleted.'
    if (error.statusCode === 409)
      return (
        error.message ||
        error.backendError ||
        'This space cannot be deleted because it has active reservations.'
      )
    if (error.isServerError())
      return "We're having technical issues. Please try again."
    // For 400/422 validation: backend message is often actionable
    return error.message || error.backendError || 'Something went wrong.'
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (
      msg.includes('network') ||
      msg.includes('fetch') ||
      msg.includes('econnrefused')
    ) {
      return 'Connection problem. Check your internet and try again.'
    }
  }
  return 'Something went wrong. Please try again.'
}
