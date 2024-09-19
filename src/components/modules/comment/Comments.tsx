'use client'

import { BusinessEvents } from '@mx-space/webhook'
import type { FC } from 'react'
import { memo, useEffect } from 'react'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'
import { useTypeScriptHappyCallback } from '~/hooks/common/use-callback'
import { WsEvent } from '~/socket/util'

import { Comment } from './Comment'
import { CommentBoxProvider } from './CommentBox/providers'
import { CommentProvider, useUpdateComment } from './CommentProvider'
import type { CommentBaseProps } from './types'

export const Comments: FC<CommentBaseProps> = ({ refId }) => {
  return (
    <ErrorBoundary>
      <CommentProvider refId={refId}>
        {useTypeScriptHappyCallback(
          (data) => {
            // sort by pin
            const comments = data?.pages.flatMap((data) => data.data)

            return (
              <ul className="min-h-[400px] list-none space-y-4">
                {comments.map((comment) => (
                  <BottomToUpSoftScaleTransitionView key={comment.id}>
                    <CommentListItem commentId={comment.id} refId={refId} />
                  </BottomToUpSoftScaleTransitionView>
                ))}
                <CommentEventHandler refId={refId} />
              </ul>
            )
          },
          [refId],
        )}
      </CommentProvider>
    </ErrorBoundary>
  )
}

const CommentListItem: FC<{ commentId: string; refId: string }> = memo(
  function CommentListItem({ commentId, refId }) {
    return (
      <CommentBoxProvider refId={refId}>
        <Comment commentId={commentId} />
      </CommentBoxProvider>
    )
  },
)

const CommentEventHandler = ({ refId }: { refId: string }) => {
  useEffect(() => {
    const currentTitle = document.title

    // 当标签页回复前台状态时，将标题重置
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        document.title = currentTitle
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const cleaner = WsEvent.on(BusinessEvents.COMMENT_CREATE, (data) => {
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
  const updateCommentUI = useUpdateComment()
  useEffect(() => {
    const cleaner = WsEvent.on(BusinessEvents.COMMENT_UPDATE, (data) => {
      updateCommentUI({
        id: data.id,
        text: data.text,
      })
    })
    return () => {
      cleaner()
    }
  }, [updateCommentUI])
  return null
}
