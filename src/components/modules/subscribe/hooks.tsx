import { useQuery } from '@tanstack/react-query'
import type { SubscribeTypeToBitMap } from '@mx-space/api-client'

import { useModalStack } from '~/components/ui/modal'
import { apiClient } from '~/lib/request.new'

import { SubscribeModal } from './SubscribeModal'

const QUERY_CHECK_SUBSCRIBE_KEY = ['subscribe-status']

export const useSubscribeStatusQuery = () => {
  return useQuery({
    queryKey: QUERY_CHECK_SUBSCRIBE_KEY,
    queryFn: apiClient.subscribe.check,
    gcTime: 60_000 * 10,
  })
}

export const useIsEnableSubscribe = () =>
  useQuery({
    queryKey: QUERY_CHECK_SUBSCRIBE_KEY,
    queryFn: apiClient.subscribe.check,
    select: (data: { enable: boolean }) => data?.enable,
    gcTime: 60_000 * 10,
    staleTime: 60_000 * 10,
    meta: {
      persist: false,
    },
  })

export const usePresentSubscribeModal = (
  defaultTypes?: (keyof typeof SubscribeTypeToBitMap)[],
) => {
  const { present } = useModalStack()

  return {
    present: () => {
      const dispose = present({
        title: '邮件订阅',
        clickOutsideToDismiss: true,
        content: () => (
          <SubscribeModal onConfirm={dispose} defaultTypes={defaultTypes} />
        ),
      })
    },
  }
}
