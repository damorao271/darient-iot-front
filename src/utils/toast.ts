import { toast } from 'sonner'
import { getUserFriendlyMessage } from './error-messages'

/**
 * Show an error toast with a user-friendly message.
 * Use for mutations (create, update, delete) and background operations.
 */
export function showErrorToast(error: unknown): void {
  toast.error(getUserFriendlyMessage(error))
}
