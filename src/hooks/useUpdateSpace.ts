import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSpace } from '../api/spaces'
import type { Space } from '../types/spaces.types'
import type { CreateSpaceFormValues } from '../schemas/space.schema'
import { queryKeys } from '../api/query-keys'
import { showErrorToast } from '../utils/toast'
import { toast } from 'sonner'

export function useUpdateSpace(placeId: string) {
  const queryClient = useQueryClient()

  return useMutation<
    Space,
    Error,
    { spaceId: string; values: CreateSpaceFormValues }
  >({
    mutationFn: ({ spaceId, values }) => updateSpace(spaceId, values),
    onSuccess: () => {
      toast.success('Space updated successfully')
      queryClient.invalidateQueries({
        queryKey: queryKeys.places.spacesAll(placeId),
      })
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
