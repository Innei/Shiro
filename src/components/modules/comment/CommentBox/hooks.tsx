'use client'

import type {
  CommentDto,
  CommentModel,
  PaginateResult,
  RequestError,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import type { ExtractAtomValue } from 'jotai'
import { atom, useAtomValue } from 'jotai'
import { atomWithStorage, selectAtom } from 'jotai/utils'
import type { PropsWithChildren } from 'react'
import { useCallback, useContext } from 'react'

import { useIsLogged } from '~/atoms/hooks'
import { apiClient } from '~/lib/request'
import { getErrorMessageFromRequestError } from '~/lib/request.shared'
import { jotaiStore } from '~/lib/store'
import { toast } from '~/lib/toast'
import { buildCommentsQueryKey } from '~/queries/keys'

import { MAX_COMMENT_TEXT_LENGTH } from './constants'
import type { createInitialValue } from './providers'
import {
  CommentBoxContext,
  CommentBoxLifeCycleContext,
  CommentCompletedCallbackContext,
  CommentIsReplyContext,
  CommentOriginalRefIdContext,
} from './providers'

export const useUseCommentReply = () => useContext(CommentIsReplyContext)

export const useCommentOriginalRefId = () => {
  const fallbackRefId = useAtomValue(useContext(CommentBoxContext).refId)
  return useContext(CommentOriginalRefIdContext) || fallbackRefId
}

export const useCommentCompletedCallback = () =>
  useContext(CommentCompletedCallbackContext)

export const useCommentBoxTextValue = () =>
  useAtomValue(useContext(CommentBoxContext).text)

export const useCommentBoxRefIdValue = () =>
  useAtomValue(useContext(CommentBoxContext).refId)

export const useGetCommentBoxAtomValues = () => useContext(CommentBoxContext)
export const useCommentBoxLifeCycle = () =>
  useContext(CommentBoxLifeCycleContext)

// ReactNode 导致 tsx 无法推断，过于复杂
const commentActionLeftSlotAtom = atom(null as PropsWithChildren['children'])
export const useCommentActionLeftSlot = () =>
  useAtomValue(commentActionLeftSlotAtom)

export const setCommentActionLeftSlot = (slot: PropsWithChildren['children']) =>
  jotaiStore.set(commentActionLeftSlotAtom, slot)

export const useCommentBoxHasText = () =>
  useAtomValue(
    selectAtom(
      useContext(CommentBoxContext).text,
      useCallback((v) => v.length > 0, []),
    ),
  )

export const useCommentBoxTextIsOversize = () =>
  useAtomValue(
    selectAtom(
      useContext(CommentBoxContext).text,
      useCallback((v) => v.length > MAX_COMMENT_TEXT_LENGTH, []),
    ),
  )
type CommentContextValue = ReturnType<typeof createInitialValue>

export const useSetCommentBoxValues = <
  T extends keyof CommentContextValue,
>() => {
  const ctx = useContext(CommentBoxContext)
  return useCallback(
    (key: T, value: ExtractAtomValue<CommentContextValue[T]>) => {
      const atom = ctx[key]
      if (!atom) throw new Error(`atom ${key} not found`)
      jotaiStore.set(atom as any, value)
    },
    [ctx],
  )
}

// Comment Mode

export const enum CommentBoxMode {
  'legacy',
  'with-auth',
}

const commentModeAtom = atomWithStorage(
  'comment-mode',
  CommentBoxMode['with-auth'],
)

export const useCommentMode = () => useAtomValue(commentModeAtom)
export const setCommentMode = (mode: CommentBoxMode) =>
  jotaiStore.set(commentModeAtom, mode)

export const useSendComment = () => {
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

      const commentListQueryKey = buildCommentsQueryKey(originalRefId)

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

  return [
    useCallback(() => mutate(commentRefId), [commentRefId, mutate]),
    isPending,
  ] as const
}
