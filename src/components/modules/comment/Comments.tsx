'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { memo, useEffect, useMemo } from 'react'
import type { FC } from 'react'
import type { CommentBaseProps } from './types'

import { BusinessEvents } from '@mx-space/webhook'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { NotSupport } from '~/components/common/NotSupport'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'
import { apiClient } from '~/lib/request'
import { buildCommentsQueryKey } from '~/queries/keys'
import { WsEvent } from '~/socket/util'

import { LoadMoreIndicator } from '../shared/LoadMoreIndicator'
import { Comment } from './Comment'
import { CommentBoxProvider } from './CommentBox/providers'
import { CommentSkeleton } from './CommentSkeleton'

const useNewCommentObserver = (refId: string) => {
  useEffect(() => {
    const currentTitle = document.title

    // 当标签页回复前台状态时，将标题重置
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        document.title = currentTitle
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const cleaner = WsEvent.on(BusinessEvents.COMMENT_CREATE, (data: any) => {
      if (data.ref === refId) {
        // 如果标签页在后台

        if (document.visibilityState === 'hidden') {
          document.title = `新评论！${currentTitle}`
        }
      }
    })
    return () => {
      cleaner()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [refId])
}
export const Comments: FC<CommentBaseProps> = ({ refId }) => {
  useNewCommentObserver(refId)

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
