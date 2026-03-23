import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSpace } from '../api/spaces'
import type { Space } from '../types/spaces.types'
import type { CreateSpaceFormValues } from '../schemas/space.schema'
import { queryKeys } from '../api/query-keys'
import { showErrorToast } from '../utils/toast'
import { toast } from 'sonner'

export function useCreateSpace(placeId: string) {
  const queryClient = useQueryClient()

  return useMutation<Space, Error, CreateSpaceFormValues>({
    mutationFn: (values) => createSpace({ ...values, placeId }),
    onSuccess: () => {
      toast.success('Space created successfully')
      queryClient.invalidateQueries({
        queryKey: queryKeys.places.spaces(placeId),
      })
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
