'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import type { FC } from 'react'
import type { CommentBaseProps } from './types'

import { Loading } from '~/components/ui/loading'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { apiClient } from '~/utils/request'

import { Comment } from './Comment'
import { CommentSkeleton } from './CommentSkeleton'

export const Comments: FC<CommentBaseProps> = ({ refId }) => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['comments', refId],
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
              <BottomToUpSoftScaleTransitionView key={comment.id}>
                <Comment comment={comment} showLine={index > 0} />
              </BottomToUpSoftScaleTransitionView>
            )
          }),
        )}
      </ul>
      {hasNextPage && <LoadMoreIndicator onClick={fetchNextPage} />}
    </>
  )
}

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
