import { useCallback, useState } from 'react'
import clsx from 'clsx'
import type { FC } from 'react'

import { AutoResizeHeight } from '~/components/widgets/shared/AutoResizeHeight'

import { CommentBoxRootLazy } from '.'
import { CommentBoxHolderPortal } from './Comment'
import { useCommentBoxRefIdValue } from './CommentBox/hooks'
import { CommentIsReplyProvider } from './CommentBox/providers'

export const CommentReplyButton: FC<{
  commentId: string
}> = ({ commentId }) => {
  const [replyFormOpen, setReplyFormOpen] = useState(false)
  const originalRefId = useCommentBoxRefIdValue()
  const onReplyCompleted = useCallback(() => {
    setReplyFormOpen(false)
  }, [])
  return (
    <>
      <button
        aria-label="回复"
        className={clsx(
          'absolute bottom-0 right-0 translate-x-2/3 translate-y-1/4 text-xs opacity-90',
          'aspect-square rounded-full',
          'box-content flex h-6 w-6 p-[2px] center',
          'border border-slate-200 bg-zinc-100 dark:border-neutral-700 dark:bg-gray-800',
          'invisible cursor-pointer opacity-0',
          'group-[:hover]:visible group-[:hover]:opacity-70',
        )}
        onClick={() => {
          setReplyFormOpen((o) => !o)
        }}
      >
        <i className="icon-[mingcute--comment-line]" />
      </button>
      <CommentBoxHolderPortal>
        <CommentIsReplyProvider
          isReply
          originalRefId={originalRefId}
          onCompleted={onReplyCompleted}
        >
          <AutoResizeHeight duration={0.2}>
            {replyFormOpen && (
              <>
                <div className="h-6" />
                <CommentBoxRootLazy refId={commentId} />
                <div className="h-6" />
              </>
            )}
          </AutoResizeHeight>
        </CommentIsReplyProvider>
      </CommentBoxHolderPortal>
    </>
  )
}
