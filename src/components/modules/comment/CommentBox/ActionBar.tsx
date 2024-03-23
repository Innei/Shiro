'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, m } from 'framer-motion'
import { produce } from 'immer'
import { useAtomValue } from 'jotai'
import type {
  CommentDto,
  CommentModel,
  PaginateResult,
  RequestError,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'

import { useIsLogged } from '~/atoms/hooks'
import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { MLink } from '~/components/ui/link/MLink'
import { clsxm } from '~/lib/helper'
import { apiClient, getErrorMessageFromRequestError } from '~/lib/request.new'
import { jotaiStore } from '~/lib/store'
import { toast } from '~/lib/toast'

import { buildQueryKey } from '../Comments'
import { MAX_COMMENT_TEXT_LENGTH } from './constants'
import {
  useCommentBoxHasText,
  useCommentBoxLifeCycle,
  useCommentBoxRefIdValue,
  useCommentBoxTextIsOversize,
  useCommentBoxTextValue,
  useCommentCompletedCallback,
  useCommentOriginalRefId,
  useGetCommentBoxAtomValues,
  useSetCommentBoxValues,
  useUseCommentReply,
} from './hooks'
import { CommentBoxSlotProvider } from './providers'

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

const WhisperCheckbox = () => {
  const isLogged = useIsLogged()
  const isReply = useUseCommentReply()
  const isWhisper = useAtomValue(useGetCommentBoxAtomValues().isWhisper)
  const setter = useSetCommentBoxValues()
  if (isLogged) return null
  if (isReply) return null
  return (
    <label className="label mx-2 flex items-center">
      <input
        className="checkbox-accent checkbox checkbox-sm mr-2"
        checked={isWhisper}
        type="checkbox"
        onChange={(e) => {
          const checked = e.target.checked
          setter('isWhisper', checked)
        }}
      />
      <span className="label-text text-sm">悄悄话</span>
    </label>
  )
}

const SyncToRecentlyCheckbox = () => {
  const isLogged = useIsLogged()
  const syncToRecently = useAtomValue(
    useGetCommentBoxAtomValues().syncToRecently,
  )
  const setter = useSetCommentBoxValues()
  const isReply = useUseCommentReply()
  if (!isLogged) return null
  if (isReply) return null
  return (
    <label className="label mx-2 flex items-center">
      <input
        className="checkbox-accent checkbox checkbox-sm mr-2"
        checked={syncToRecently}
        type="checkbox"
        onChange={(e) => {
          const checked = e.target.checked
          setter('syncToRecently', checked)
        }}
      />
      <span className="label-text text-sm">同步到碎碎念</span>
    </label>
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
        )}
      >
        <span className="hidden md:inline">
          支持 <b>Markdown</b> 与{' '}
          <MLink href="https://docs.github.com/zh/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax">
            GFM
          </MLink>
        </span>
        <CommentBoxSlotProvider />
      </span>
      <AnimatePresence>
        {hasCommentText && (
          <m.aside
            key="send-button-wrapper"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            className="flex select-none items-center gap-2.5"
          >
            <TextLengthIndicator />

            <WhisperCheckbox />
            <SyncToRecentlyCheckbox />
            <SubmitButton />
          </m.aside>
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
    url: urlAtom,

    source: sourceAtom,
    avatar: avatarAtom,

    isWhisper: isWhisperAtom,
    syncToRecently: syncToRecentlyAtom,
  } = useGetCommentBoxAtomValues()
  const { afterSubmit } = useCommentBoxLifeCycle()
  const isLogged = useIsLogged()
  const queryClient = useQueryClient()
  const isReply = useUseCommentReply()
  const originalRefId = useCommentOriginalRefId()
  const completedCallback = useCommentCompletedCallback()

  const wrappedCompletedCallback = <T extends CommentModel>(data: T): T => {
    completedCallback?.(data)
    return data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (refId: string) => {
      const text = jotaiStore.get(textAtom)
      const author = jotaiStore.get(authorAtom)
      const mail = jotaiStore.get(mailAtom)
      const avatar = jotaiStore.get(avatarAtom)
      const source = jotaiStore.get(sourceAtom) as any
      const url = jotaiStore.get(urlAtom)

      const commentDto: CommentDto = { text, author, mail, avatar, source, url }

      if (isLogged) {
        delete commentDto.avatar
      }

      // Omit empty string key
      Object.keys(commentDto).forEach((key) => {
        // @ts-expect-error
        if (commentDto[key] === '') delete commentDto[key]
      })

      // Reply Comment
      if (isReply) {
        if (isLogged) {
          return apiClient.comment.proxy.master
            .reply(refId)
            .post<CommentModel>({
              data: {
                text,
                source,
              },
            })
            .then(wrappedCompletedCallback)
        } else {
          return apiClient.comment
            .reply(refId, commentDto)
            .then(wrappedCompletedCallback)
        }
      }

      // Normal Comment
      const isWhisper = jotaiStore.get(isWhisperAtom)
      const syncToRecently = jotaiStore.get(syncToRecentlyAtom)

      if (isLogged) {
        return apiClient.comment.proxy.master
          .comment(refId)
          .post<CommentModel>({
            data: { text, source },
          })
          .then(async (res) => {
            if (syncToRecently)
              apiClient.recently.proxy
                .post({
                  data: {
                    content: text,
                    ref: refId,
                  },
                })
                .then(() => {
                  toast.success('已同步到碎碎念')
                })

            return res
          })
          .then(wrappedCompletedCallback)
      }
      // @ts-ignore
      commentDto.isWhispers = isWhisper
      return apiClient.comment
        .comment(refId, commentDto)
        .then(wrappedCompletedCallback)
    },
    mutationKey: [commentRefId, 'comment'],
    onError(error: RequestError) {
      toast.error(getErrorMessageFromRequestError(error))
    },
    onSuccess(data) {
      afterSubmit?.()

      const toastCopy = isLogged
        ? '发表成功啦~'
        : isReply
          ? '感谢你的回复！'
          : '感谢你的评论！'

      const commentListQueryKey = buildQueryKey(originalRefId)

      toast.success(toastCopy)
      jotaiStore.set(textAtom, '')
      queryClient.setQueryData<
        InfiniteData<
          PaginateResult<
            CommentModel & {
              ref: string
            }
          >
        >
      >(commentListQueryKey, (oldData) => {
        if (!oldData) return oldData
        if (isReply) {
          // find the reply refed comment

          return produce(oldData, (draft) => {
            const dfs = (
              data: CommentModel,
              commentRefId: string,
              newData: CommentModel & { new?: boolean },
            ) => {
              if (data.id === commentRefId) {
                if (!data.children) {
                  data.children = []
                }
                ;(data.children as (CommentModel & { new: boolean })[]).push({
                  ...newData,
                  new: true,
                })
                return true
              }
              if (!data.children) {
                return
              }
              for (const child of data.children) {
                if (dfs(child, commentRefId, newData)) {
                  return true
                }
              }
              return false
            }

            const dataToAdd = {
              ...data,
              new: true,
            }

            for (const page of draft.pages) {
              for (const item of page.data) {
                if (dfs(item, commentRefId, dataToAdd)) {
                  break
                }
              }
            }
          })
        }

        return produce(oldData, (draft) => {
          draft.pages[0].data.unshift({
            ...data,
            // @ts-ignore
            new: true,
          })
        })
      })
    },
  })
  const onClickSend = () => {
    mutate(commentRefId)
  }
  return (
    <m.button
      className="flex appearance-none items-center space-x-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      disabled={isPending}
      onClick={onClickSend}
    >
      <TiltedSendIcon className="size-5 text-zinc-800 dark:text-zinc-200" />
      <m.span className="text-sm" layout="size">
        {isPending ? '送信...' : '送信'}
      </m.span>
    </m.button>
  )
}
