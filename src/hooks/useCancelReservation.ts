import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelReservation } from '../api/reservations'

import { showErrorToast } from '../utils/toast'
import { toast } from 'sonner'

export interface UseCancelReservationOptions {
  /** When true (default), show error toast. Set false when showing errors inline (e.g. in a modal). */
  showErrorToast?: boolean
}

export function useCancelReservation(
  options: UseCancelReservationOptions = {},
) {
  const { showErrorToast: shouldShowErrorToast = true } = options
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: cancelReservation,
    onSuccess: () => {
      toast.success('Reservation cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
    },
    onError: (error) => {
      if (shouldShowErrorToast) showErrorToast(error)
    },
  })
}
