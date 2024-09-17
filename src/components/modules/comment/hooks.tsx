import type {
  CommentModel,
  PaginateResult,
  ReaderModel,
} from '@mx-space/api-client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { apiClient } from '~/lib/request'
import { buildCommentsQueryKey } from '~/queries/keys'

export function useCommentsQuery(
  refId: string,
  onData: (
    data: PaginateResult<
      CommentModel & {
        ref: string
      }
    > & {
      readers: Record<string, ReaderModel>
    },
  ) => void,
) {
  const key = useMemo(() => buildCommentsQueryKey(refId), [refId])
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: key,
    queryFn: async ({ queryKey, pageParam }) => {
      const page = pageParam
      const [, refId] = queryKey as [string, string]
      const data = await apiClient.comment.getByRefId(refId, {
        page,
      })
      onData(data.$serialized)
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
