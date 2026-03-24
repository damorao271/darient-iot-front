import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDesiredConfig } from '../api/iot'
import { queryKeys } from '../api/query-keys'
import type { UpdateDesiredBody } from '../types/iot.types'
import { showErrorToast } from '../utils/toast'
import { toast } from 'sonner'

export function useUpdateDesired(spaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateDesiredBody) => updateDesiredConfig(spaceId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.iot.device(spaceId),
      })
      toast.success('Desired configuration updated and published to device')
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
