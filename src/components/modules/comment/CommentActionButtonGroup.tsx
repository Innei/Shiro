import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { m } from 'motion/react'
import type { FC } from 'react'
import { useCallback, useRef, useState } from 'react'

import { useIsLogged } from '~/atoms/hooks/owner'
import { useSessionReader } from '~/atoms/hooks/reader'
import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { TextArea } from '~/components/ui/input'
import { apiClient } from '~/lib/request'

import { CommentBoxRootLazy } from '.'
import { CommentBoxHolderPortal } from './Comment'
import { useCommentBoxRefIdValue } from './CommentBox/hooks'
import { CommentIsReplyProvider } from './CommentBox/providers'
import { useCommentByIdSelector, useUpdateComment } from './CommentProvider'

export const CommentActionButtonGroup: FC<{
  commentId: string
  className?: string
}> = ({ commentId, className }) => {
  const [replyFormOpen, setReplyFormOpen] = useState(false)
  const [editFormOpen, setEditFormOpen] = useState(false)
  const originalRefId = useCommentBoxRefIdValue()
  const onReplyCompleted = useCallback(() => {
    setReplyFormOpen(false)
  }, [])

  const isOwner = useIsLogged()
  const readerId = useCommentByIdSelector(
    commentId,
    useCallback((comment) => comment?.readerId, []),
  )
  const readerSession = useSessionReader()
  const canEdit = isOwner || (readerId && readerId === readerSession?.id)
  const isButtonGroup = canEdit
  return (
    <div className="absolute bottom-0 right-0 flex min-h-0 translate-x-2/3 translate-y-1/4 items-center">
      {canEdit && (
        <button
          aria-label="编辑"
          className={clsx(
            'text-xs',
            'aspect-square',
            !isButtonGroup ? 'rounded-full' : 'rounded-l-full border-r-0',
            'center box-content flex size-6 p-[2px]',
            'border border-slate-200 bg-zinc-100 dark:border-neutral-700 dark:bg-gray-800',
            'invisible cursor-pointer opacity-0',
            'group-[:hover]:visible group-[:hover]:opacity-70',
            className,
          )}
          onClick={() => {
            setReplyFormOpen(false)
            setEditFormOpen((s) => !s)
          }}
        >
          <i className="i-mingcute-edit-2-line" />
        </button>
      )}
      {isButtonGroup && (
        <div className="pointer-events-none hidden h-full w-px shrink-0 select-none border-l border-base-content/10 text-transparent group-hover:inline-block">
          {'1'}
        </div>
      )}
      <button
        aria-label="回复"
        className={clsx(
          'text-xs',
          'aspect-square',
          !isButtonGroup ? 'rounded-full' : 'rounded-r-full border-l-0',
          'center box-content flex size-6 p-[2px]',
          'border border-slate-200 bg-zinc-100 dark:border-neutral-700 dark:bg-gray-800',
          'invisible cursor-pointer opacity-0',
          'group-[:hover]:visible group-[:hover]:opacity-70',
          className,
        )}
        onClick={() => {
          setEditFormOpen(false)
          setReplyFormOpen((o) => !o)
        }}
      >
        <i className="i-mingcute-comment-line" />
      </button>
      <CommentBoxHolderPortal>
        <CommentIsReplyProvider
          isReply
          originalRefId={originalRefId}
          onCompleted={onReplyCompleted}
        >
          <AutoResizeHeight duration={0.2}>
            {replyFormOpen && (
              <div className="py-6">
                <CommentBoxRootLazy refId={commentId} />
              </div>
            )}
          </AutoResizeHeight>
        </CommentIsReplyProvider>
      </CommentBoxHolderPortal>

      <CommentBoxHolderPortal>
        <AutoResizeHeight duration={0.2}>
          {editFormOpen && (
            <EditCommentForm
              commentId={commentId}
              onCompleted={() => {
                setEditFormOpen(false)
              }}
            />
          )}
        </AutoResizeHeight>
      </CommentBoxHolderPortal>
    </div>
  )
}

const EditCommentForm: FC<{
  commentId: string
  onCompleted: () => void
}> = ({ commentId, onCompleted }) => {
  const commentText = useCommentByIdSelector(
    commentId,
    useCallback((comment) => comment?.text, []),
  )
  const { mutateAsync: updateComment, isPending } = useMutation({
    mutationFn: (text: string) => {
      return apiClient.comment.proxy.edit(commentId).patch({
        data: {
          text,
        },
      })
    },
  })
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const updateCommentUI = useUpdateComment()
  return (
    <div className="px-2 py-6">
      <div className="mb-2 pl-2 text-sm">你正在编辑评论：</div>
      <div className="relative">
        <TextArea
          ref={textAreaRef}
          defaultValue={commentText}
          wrapperClassName="bg-gray-200/50 dark:bg-zinc-800/50 rounded-xl h-[150px]"
        />
        <div className="absolute bottom-2 right-4 flex items-center gap-2">
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="flex items-center gap-1"
            onClick={() => {
              onCompleted()
            }}
          >
            <i className="i-mingcute-close-line" />
            <span className="text-sm">取消</span>
          </m.button>
          <SaveButton
            isPending={isPending}
            onClickSave={() => {
              const text = textAreaRef.current?.value
              if (!text) {
                return
              }
              updateComment(text).then(() => {
                onCompleted()
                updateCommentUI({
                  id: commentId,
                  text,
                })
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

const SaveButton: FC<{
  isPending: boolean
  onClickSave: () => void
}> = ({ isPending, onClickSave }) => {
  return (
    <m.button
      className="flex appearance-none items-center space-x-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      disabled={isPending}
      onClick={onClickSave}
    >
      {isPending ? (
        <i className="loading loading-spinner loading-sm size-4" />
      ) : (
        <TiltedSendIcon />
      )}
      <m.span className="text-sm" layout="size">
        {isPending ? '' : '保存'}
      </m.span>
    </m.button>
  )
}
