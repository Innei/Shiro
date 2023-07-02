'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { memo, useMemo } from 'react'
import type { FC } from 'react'
import type { CommentBaseProps } from './types'

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
      {hasNextPage && (
        <LoadMoreIndicator onLoading={fetchNextPage}>
          <CommentSkeleton />
        </LoadMoreIndicator>
      )}
    </>
  )
}

const CommentListItem: FC<{ comment: any; refId: string; index: number }> =
  memo(function CommentListItem({ comment, refId, index }) {
    return (
      <CommentBoxProvider refId={refId}>
        <Comment comment={comment} showLine={index > 0} />
      </CommentBoxProvider>
    )
  })
