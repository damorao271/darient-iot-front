import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReservation } from '../api/reservations'
import type { CreateReservationFormValues } from '../schemas/reservation.schema'
import { queryKeys } from '../api/query-keys'
import { showErrorToast } from '../utils/toast'
import { toast } from 'sonner'

export function useCreateReservation(spaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreateReservationFormValues) =>
      createReservation({
        ...values,
        spaceId,
        reservationDate: `${values.reservationDate}T00:00:00.000Z`,
      }),
    onSuccess: () => {
      toast.success('Reservation created successfully')
      queryClient.invalidateQueries({
        queryKey: queryKeys.spaces.detail(spaceId),
      })
      queryClient.invalidateQueries({
        queryKey: ['reservations', 'list'],
      })
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
