import { queryClient } from '~/providers/root/react-query-provider'
import { useEffect } from 'react'

import { apiClient } from '~/lib/request.new'

export const useAckReadCount = (type: 'post' | 'note', id: string) => {
  useEffect(() => {
    queryClient.fetchQuery({
      queryKey: ['ack-read-count', type, id],
      queryFn: async () => {
        return apiClient.ack.read(type, id)
      },
    })
  }, [])
}
