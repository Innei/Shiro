'use client'

import type {
  CommentDto,
  CommentModel,
  RequestError,
} from '@mx-space/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ExtractAtomValue } from 'jotai'
import { atom, useAtomValue } from 'jotai'
import { atomWithStorage, selectAtom } from 'jotai/utils'
import { useTranslations } from 'next-intl'
import type { PropsWithChildren } from 'react'
import { use, useCallback } from 'react'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { apiClient } from '~/lib/request'
import { getErrorMessageFromRequestError } from '~/lib/request.shared'
import { jotaiStore } from '~/lib/store'
import { toast } from '~/lib/toast'
import { buildCommentsQueryKey } from '~/queries/keys'

import type { CommentAnchor } from '../types'
import { MAX_COMMENT_TEXT_LENGTH } from './constants'
import type { createInitialValue } from './providers'
import {
  CommentBoxContext,
  CommentBoxLifeCycleContext,
  CommentCompactContext,
  CommentCompletedCallbackContext,
  CommentIsReplyContext,
  CommentOriginalRefIdContext,
} from './providers'

export const useCommentCompact = () => use(CommentCompactContext)
export const useUseCommentReply = () => use(CommentIsReplyContext)

export const useCommentOriginalRefId = () => {
  const fallbackRefId = useAtomValue(use(CommentBoxContext).refId)
  return use(CommentOriginalRefIdContext) || fallbackRefId
}

export const useCommentCompletedCallback = () =>
  use(CommentCompletedCallbackContext)

export const useCommentBoxTextValue = () =>
  useAtomValue(use(CommentBoxContext).text)

export const useCommentBoxRefIdValue = () =>
  useAtomValue(use(CommentBoxContext).refId)

export const useGetCommentBoxAtomValues = () => use(CommentBoxContext)
export const useCommentBoxLifeCycle = () => use(CommentBoxLifeCycleContext)

// ReactNode 导致 tsx 无法推断，过于复杂
const commentActionLeftSlotAtom = atom(null as PropsWithChildren['children'])
export const useCommentActionLeftSlot = () =>
  useAtomValue(commentActionLeftSlotAtom)

export const setCommentActionLeftSlot = (slot: PropsWithChildren['children']) =>
  jotaiStore.set(commentActionLeftSlotAtom, slot)

export const useCommentBoxHasText = () =>
  useAtomValue(
    selectAtom(
      use(CommentBoxContext).text,
      useCallback((v) => v.length > 0, []),
    ),
  )

export const useCommentBoxTextIsOversize = () =>
  useAtomValue(
    selectAtom(
      use(CommentBoxContext).text,
      useCallback((v) => v.length > MAX_COMMENT_TEXT_LENGTH, []),
    ),
  )
type CommentContextValue = ReturnType<typeof createInitialValue>

export const useSetCommentBoxValues = <
  T extends keyof CommentContextValue,
>() => {
  const ctx = use(CommentBoxContext)
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
  const t = useTranslations('comment')
  const commentRefId = useCommentBoxRefIdValue()
  const {
    text: textAtom,
    author: authorAtom,
    mail: mailAtom,
    url: urlAtom,

    source: sourceAtom,
    avatar: avatarAtom,

    anchor: anchorAtom,

    isWhisper: isWhisperAtom,
    syncToRecently: syncToRecentlyAtom,
  } = useGetCommentBoxAtomValues()
  const { afterSubmit } = useCommentBoxLifeCycle()
  const isLogged = useIsOwnerLogged()
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
      const anchor = jotaiStore.get(anchorAtom)

      const commentDto: CommentDto & { anchor?: CommentAnchor } = {
        text,
        author,
        mail,
        avatar,
        source,
        url,
      }
      if (anchor) commentDto.anchor = anchor

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
          return apiClient.comment.proxy.owner
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
        return apiClient.comment.proxy.owner
          .comment(refId)
          .post<CommentModel>({
            data: { text, source, ...(anchor ? { anchor } : {}) },
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
                  toast.success(t('synced_to_thinking'))
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
    onSuccess() {
      afterSubmit?.()

      const toastCopy = isLogged
        ? t('submit_success')
        : isReply
          ? t('reply_success')
          : t('comment_success')

      const commentListQueryKey = buildCommentsQueryKey(originalRefId)

      toast.success(toastCopy)
      jotaiStore.set(textAtom, '')
      jotaiStore.set(anchorAtom, null)
      queryClient.invalidateQueries({
        queryKey: commentListQueryKey,
      })
    },
  })

  return [
    useCallback(() => mutate(commentRefId), [commentRefId, mutate]),
    isPending,
  ] as const
}
