'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { produce } from 'immer'
import type {
  CommentModel,
  PaginateResult,
  RequestError,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'

import { useIsLogged } from '~/atoms'
import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { MLink } from '~/components/ui/markdown/renderers/link'
import { jotaiStore } from '~/lib/store'
import { toast } from '~/lib/toast'
import { clsxm } from '~/utils/helper'
import { apiClient, getErrorMessageFromRequestError } from '~/utils/request'

import { buildQueryKey } from '../Comments'
import {
  useCommentBoxHasText,
  useCommentBoxRefIdValue,
  useCommentBoxTextIsOversize,
  useCommentBoxTextValue,
  useCommentCompletedCallback,
  useCommentOriginalRefId,
  useGetCommentBoxAtomValues,
  useUseCommentReply,
} from './CommentBoxProvider'
import { MAX_COMMENT_TEXT_LENGTH } from './constants'

const TextLengthIndicator = () => {
  const isTextOversize = useCommentBoxTextIsOversize()
  const commentValue = useCommentBoxTextValue()
  return (
    <span
      className={clsx(
        'font-mono text-[10px]',
        isTextOversize ? 'text-red-500' : 'text-zinc-500',
      )}
    >
      {commentValue.length}/{MAX_COMMENT_TEXT_LENGTH}
    </span>
  )
}
export const CommentBoxActionBar: Component = ({ className }) => {
  const hasCommentText = useCommentBoxHasText()

  return (
    <footer
      className={clsxm(
        'mt-3 flex h-5 w-full min-w-0 items-center justify-between',
        className,
      )}
    >
      <span
        className={clsx(
          'flex-1 select-none text-[10px] text-zinc-500 transition-opacity',
          hasCommentText ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        支持 <b>Markdown</b> 与{' '}
        <MLink href="https://docs.github.com/zh/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax">
          GFM
        </MLink>
      </span>
      <AnimatePresence>
        {hasCommentText && (
          <motion.aside
            key="send-button-wrapper"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            className="flex select-none items-center gap-2.5"
          >
            <TextLengthIndicator />

            <SubmitButton />
          </motion.aside>
        )}
      </AnimatePresence>
    </footer>
  )
}

const SubmitButton = () => {
  const commentRefId = useCommentBoxRefIdValue()
  const {
    text: textAtom,
    author: authorAtom,
    mail: mailAtom,
  } = useGetCommentBoxAtomValues()
  const isLogged = useIsLogged()
  const queryClient = useQueryClient()
  const isReply = useUseCommentReply()
  const originalRefId = useCommentOriginalRefId()
  const complatedCallback = useCommentCompletedCallback()

  const wrappedComplatedCallback = useCallback(
    <T extends CommentModel>(data: T): T => {
      complatedCallback?.(data)
      return data
    },
    [complatedCallback],
  )

  const { isLoading, mutate } = useMutation({
    mutationFn: async (refId: string) => {
      const text = jotaiStore.get(textAtom)
      const author = jotaiStore.get(authorAtom)
      const mail = jotaiStore.get(mailAtom)

      const commentDto = { text, author, mail }
      if (isReply) {
        if (isLogged) {
          return apiClient.comment.proxy.master
            .reply(refId)
            .post<CommentModel>({
              data: {
                text,
              },
            })
            .then(wrappedComplatedCallback)
        } else {
          return apiClient.comment
            .reply(refId, commentDto)
            .then(wrappedComplatedCallback)
        }
      }

      if (isLogged) {
        return apiClient.comment.proxy.master
          .comment(refId)
          .post<CommentModel>({
            params: {
              ts: Date.now(),
            },
            data: { text },
          })
          .then(wrappedComplatedCallback)
      }
      return apiClient.comment
        .comment(refId, commentDto)
        .then(wrappedComplatedCallback)
    },
    mutationKey: [commentRefId, 'comment'],
    onError(error: RequestError) {
      toast.error(getErrorMessageFromRequestError(error))
    },
    onSuccess(data) {
      if (isReply) {
        toast.success('感谢你的回复！')
        jotaiStore.set(textAtom, '')

        queryClient.invalidateQueries(buildQueryKey(originalRefId))
        return
      }

      toast.success('感谢你的评论！')
      jotaiStore.set(textAtom, '')
      queryClient.setQueryData<
        InfiniteData<
          PaginateResult<
            CommentModel & {
              ref: string
            }
          >
        >
      >(buildQueryKey(commentRefId), (oldData) => {
        if (!oldData) return oldData
        return produce(oldData, (draft) => {
          draft.pages[0].data.unshift(data)
        })
      })
    },
  })
  const onClickSend = () => {
    mutate(commentRefId)
  }
  return (
    <motion.button
      className="flex appearance-none items-center space-x-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      disabled={isLoading}
      onClick={onClickSend}
    >
      <TiltedSendIcon className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
      <motion.span className="text-sm" layout="size">
        {isLoading ? '送信...' : '送信'}
      </motion.span>
    </motion.button>
  )
}
