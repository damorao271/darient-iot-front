import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateReservation } from '../api/reservations'
import type { UpdateReservationBody } from '../types/reservation.types'
import { showErrorToast } from '../utils/toast'
import { toast } from 'sonner'

export interface UseUpdateReservationOptions {
  /** When true (default), show error toast. Set false when showing errors inline (e.g. in a modal). */
  showErrorToast?: boolean
}

interface UpdateReservationArgs {
  id: string
  body: UpdateReservationBody
}

export function useUpdateReservation(
  options: UseUpdateReservationOptions = {},
) {
  const { showErrorToast: shouldShowErrorToast = true } = options
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, UpdateReservationArgs>({
    mutationFn: ({ id, body }) => updateReservation(id, body),
    onSuccess: () => {
      toast.success('Reservation updated successfully')
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['spaces'] })
    },
    onError: (error) => {
      if (shouldShowErrorToast) showErrorToast(error)
    },
  })
}
