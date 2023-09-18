'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { memo, useMemo } from 'react'
import type { FC } from 'react'
import type { CommentBaseProps } from './types'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { NotSupport } from '~/components/common/NotSupport'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { apiClient } from '~/lib/request'

import { LoadMoreIndicator } from '../shared/LoadMoreIndicator'
import { Comment } from './Comment'
import { CommentBoxProvider } from './CommentBox/providers'
import { CommentSkeleton } from './CommentSkeleton'

export const buildQueryKey = (refId: string) => ['comments', refId]
export const Comments: FC<CommentBaseProps> = ({ refId }) => {
  const key = useMemo(() => buildQueryKey(refId), [refId])
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    key,
    async ({ queryKey, pageParam }) => {
      const page = pageParam
      // const { page } = meta as { page: number }
      const [, refId] = queryKey as [string, string]
      const data = await apiClient.comment.getByRefId(refId, {
        page,
      })
      return data.$serialized
    },

    {
      meta: {
        persist: false,
      },
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasNextPage
          ? lastPage.pagination.currentPage + 1
          : false,
      getPreviousPageParam: (firstPage) => firstPage.pagination.currentPage - 1,
    },
  )

  if (isLoading) {
    return <CommentSkeleton />
  }
  if (!data || !data.pages.length || !data.pages[0].data.length)
    return (
      <div className="flex min-h-[400px] center">
        <NotSupport text="这里还没有评论呢" />
      </div>
    )
  return (
    <ErrorBoundary>
      <ul className="min-h-[400px] list-none space-y-4">
        {data?.pages.map((data, index) => {
          return (
            <BottomToUpSoftScaleTransitionView key={index}>
              {data.data.map((comment) => {
                return (
                  <CommentListItem
                    comment={comment}
                    key={comment.id}
                    refId={refId}
                  />
                )
              })}
            </BottomToUpSoftScaleTransitionView>
          )
        })}
      </ul>
      {hasNextPage && (
        <LoadMoreIndicator onLoading={fetchNextPage}>
          <CommentSkeleton />
        </LoadMoreIndicator>
      )}
    </ErrorBoundary>
  )
}

const CommentListItem: FC<{ comment: any; refId: string }> = memo(
  function CommentListItem({ comment, refId }) {
    return (
      <CommentBoxProvider refId={refId}>
        <Comment comment={comment} />
      </CommentBoxProvider>
    )
  },
)
