import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { apiClient } from '~/lib/request'
import { buildCommentsQueryKey } from '~/queries/keys'

export function useCommentsQuery(refId: string) {
  const key = useMemo(() => buildCommentsQueryKey(refId), [refId])
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: key,
    queryFn: async ({ queryKey, pageParam }) => {
      const page = pageParam
      const [, refId] = queryKey as [string, string]
      const data = await apiClient.comment.getByRefId(refId, {
        page,
      })

      return data.$serialized
    },

    meta: {
      persist: false,
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.currentPage - 1,
    initialPageParam: 1 as number | undefined,
  })

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
  }
}
