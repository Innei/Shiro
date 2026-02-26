import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

export const useLiveQuery = () => {
  const liveId = useAppConfigSelector(
    (config) => config.module?.bilibili?.liveId,
  )

  return useQuery({
    queryKey: ['live-check'],
    queryFn: () =>
      fetch(`/api/bilibili/check_live?liveId=${liveId}`, {
        next: {
          revalidate: 1,
        },
      })
        .then((res) => res.json())
        .catch(() => null),
    select: useCallback((data: any) => !!data, []),
    refetchInterval: 1000 * 60,
    enabled: !!liveId,
    meta: {
      persist: false,
    },
  })
}
