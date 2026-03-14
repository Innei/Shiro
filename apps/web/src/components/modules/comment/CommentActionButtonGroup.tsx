import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
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

const READER_EDIT_WINDOW_MS = 10 * 60 * 1000

export const CommentActionButtonGroup: FC<{
  commentId: string
  className?: string
}> = ({ commentId, className }) => {
  const tCommon = useTranslations('common')
  const [replyFormOpen, setReplyFormOpen] = useState(false)
  const [editFormOpen, setEditFormOpen] = useState(false)
  const originalRefId = useCommentBoxRefIdValue()
  const onReplyCompleted = useCallback(() => {
    setReplyFormOpen(false)
  }, [])

  const isOwner = useIsOwnerLogged()
  const readerSession = useSessionReader()
  const readerId = useCommentByIdSelector(
    commentId,
    useCallback((comment) => comment?.readerId, []),
  )
  const createdAt = useCommentByIdSelector(
    commentId,
    useCallback((comment) => comment?.created, []),
  )
  const isDeleted = useCommentByIdSelector(
    commentId,
    useCallback((comment) => comment?.isDeleted, []),
  )
  const canReaderEdit = useMemo(() => {
    if (!readerId || readerId !== readerSession?.id) return false
    if (!createdAt) return false

    const createdAtMs = new Date(createdAt).getTime()
    if (Number.isNaN(createdAtMs)) return false

    return Date.now() - createdAtMs <= READER_EDIT_WINDOW_MS
  }, [createdAt, readerId, readerSession?.id])

  const canEdit = !isDeleted && (isOwner || canReaderEdit)
  const isButtonGroup = canEdit
  return (
    <div className="absolute bottom-0 right-0 flex min-h-0 translate-x-2/3 translate-y-1/4 items-center">
      {canEdit && (
        <button
          aria-label={tCommon('actions_edit')}
          className={clsx(
            'text-xs',
            'aspect-square',
            !isButtonGroup ? 'rounded-full' : 'rounded-l-full border-r-0',
            'center box-content flex size-6 p-[2px]',
            'border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800',
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
        <div className="pointer-events-none hidden h-full w-px shrink-0 select-none border-l border-neutral-4/50 text-transparent group-hover:inline-block">
          {'1'}
        </div>
      )}
      <button
        aria-label={tCommon('actions_reply')}
        className={clsx(
          'text-xs',
          'aspect-square',
          !isButtonGroup ? 'rounded-full' : 'rounded-r-full border-l-0',
          'center box-content flex size-6 p-[2px]',
          'border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800',
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
  const tCommon = useTranslations('common')
  const tComment = useTranslations('comment')
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
      <div className="mb-2 pl-2 text-sm">{tComment('editing_comment')}</div>
      <div className="relative">
        <TextArea
          defaultValue={commentText}
          ref={textAreaRef}
          wrapperClassName="bg-neutral-200/50 dark:bg-neutral-800/50 rounded-xl h-[150px]"
        />
        <div className="absolute bottom-2 right-4 flex items-center gap-2">
          <m.button
            className="flex items-center gap-1"
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onCompleted()
            }}
          >
            <i className="i-mingcute-close-line" />
            <span className="text-sm">{tCommon('actions_cancel')}</span>
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
  const tCommon = useTranslations('common')
  return (
    <m.button
      className="flex appearance-none items-center space-x-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isPending}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClickSave}
    >
      {isPending ? (
        <i className="loading loading-spinner loading-sm size-4" />
      ) : (
        <TiltedSendIcon />
      )}
      <m.span className="text-sm" layout="size">
        {isPending ? '' : tCommon('actions_save')}
      </m.span>
    </m.button>
  )
}
