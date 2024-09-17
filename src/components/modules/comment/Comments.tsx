'use client'

import type { ReaderModel } from '@mx-space/api-client'
import { BusinessEvents } from '@mx-space/webhook'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { FC } from 'react'
import { memo, useEffect, useMemo } from 'react'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { NotSupport } from '~/components/common/NotSupport'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'
import { apiClient } from '~/lib/request'
import { buildCommentsQueryKey } from '~/queries/keys'
import { WsEvent } from '~/socket/util'

import { LoadMoreIndicator } from '../shared/LoadMoreIndicator'
import { Comment } from './Comment'
import { CommentBoxProvider } from './CommentBox/providers'
import { CommentProvider } from './CommentProvider'
import { CommentSkeleton } from './CommentSkeleton'
import type { CommentBaseProps } from './types'

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
      if (
        data.ref === refId && // 如果标签页在后台
        document.visibilityState === 'hidden'
      ) {
        document.title = `新评论！${currentTitle}`
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

  const readers = useMemo(() => {
    if (!data) return {}
    return data?.pages.reduce(
      (acc, curr) => ({ ...acc, ...curr.readers }),
      {} as Record<string, ReaderModel>,
    )
  }, [data])
  if (isLoading) {
    return <CommentSkeleton />
  }
  if (!data || data.pages.length === 0 || data.pages[0].data.length === 0)
    return (
      <div className="center flex min-h-[400px]">
        <NotSupport text="这里还没有评论呢" />
      </div>
    )
  return (
    <ErrorBoundary>
      <CommentProvider readers={readers}>
        <ul className="min-h-[400px] list-none space-y-4">
          {data?.pages.map((data, index) => (
            <BottomToUpSoftScaleTransitionView key={index}>
              {data.data.map((comment) => (
                <CommentListItem
                  comment={comment}
                  key={comment.id}
                  refId={refId}
                />
              ))}
            </BottomToUpSoftScaleTransitionView>
          ))}
        </ul>
      </CommentProvider>

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
