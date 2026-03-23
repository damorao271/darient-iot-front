import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSpace } from '../api/spaces'
import { queryKeys } from '../api/query-keys'
import { showErrorToast } from '../utils/toast'
import { toast } from 'sonner'

export interface UseDeleteSpaceOptions {
  /** When true (default), show error toast. Set false when showing errors inline (e.g. in a modal). */
  showErrorToast?: boolean
}

export function useDeleteSpace(
  placeId: string,
  options: UseDeleteSpaceOptions = {},
) {
  const { showErrorToast: shouldShowErrorToast = true } = options
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteSpace,
    onSuccess: () => {
      toast.success('Space deleted successfully')
      queryClient.invalidateQueries({
        queryKey: queryKeys.places.spacesAll(placeId),
      })
    },
    onError: (error) => {
      if (shouldShowErrorToast) showErrorToast(error)
    },
  })
}
