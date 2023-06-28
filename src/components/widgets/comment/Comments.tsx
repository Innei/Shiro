'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { memo, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import type { FC } from 'react'
import type { CommentBaseProps } from './types'

import { Loading } from '~/components/ui/loading'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { apiClient } from '~/utils/request'

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
  if (!data) return null
  return (
    <>
      <ul className="list-none space-y-4">
        {data?.pages.map((data) =>
          data.data.map((comment, index) => {
            return (
              <CommentListItem
                comment={comment}
                key={comment.id}
                refId={refId}
                index={index}
              />
            )
          }),
        )}
      </ul>
      {hasNextPage && <LoadMoreIndicator onClick={fetchNextPage} />}
    </>
  )
}

const CommentListItem: FC<{ comment: any; refId: string; index: number }> =
  memo(function CommentListItem({ comment, refId, index }) {
    return (
      <BottomToUpSoftScaleTransitionView>
        <CommentBoxProvider refId={refId}>
          <Comment comment={comment} showLine={index > 0} />
        </CommentBoxProvider>
      </BottomToUpSoftScaleTransitionView>
    )
  })

const LoadMoreIndicator: FC<{
  onClick: () => void
}> = ({ onClick }) => {
  const { ref } = useInView({
    rootMargin: '1px',
    onChange(inView) {
      if (inView) onClick()
    },
  })
  return (
    <div ref={ref}>
      <Loading />
    </div>
  )
}
