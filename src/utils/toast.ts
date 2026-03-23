import { toast } from 'sonner'
import { ApiError } from '../api/errors'
import { formatValidationDetails, getUserFriendlyMessage } from './error-messages'

/**
 * Show an error toast with a user-friendly message.
 * For 400 responses with details[], displays them in the toast description (generic for all endpoints).
 */
export function showErrorToast(error: unknown): void {
  const message = getUserFriendlyMessage(error)

  if (error instanceof ApiError && error.details?.length) {
    toast.error(message, {
      description: formatValidationDetails(error.details),
      duration: 6000,
    })
  } else {
    toast.error(message)
  }
}
