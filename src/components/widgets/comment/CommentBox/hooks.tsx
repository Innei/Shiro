'use client'

import { useCallback, useContext } from 'react'
import { atom, useAtomValue } from 'jotai'
import { atomWithStorage, selectAtom } from 'jotai/utils'
import type { ExtractAtomValue } from 'jotai'
import type React from 'react'
import type { createInitialValue } from './providers'

import { jotaiStore } from '~/lib/store'

import { MAX_COMMENT_TEXT_LENGTH } from './constants'
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

export const useGetCommentBoxAtomValues = () => {
  return useContext(CommentBoxContext)
}
export const useCommentBoxLifeCycle = () =>
  useContext(CommentBoxLifeCycleContext)

// ReactNode 导致 tsx 无法推断，过于复杂
const commentActionLeftSlotAtom = atom(null as React.JSX.Element | null)
export const useCommentActionLeftSlot = () =>
  useAtomValue(commentActionLeftSlotAtom)

export const setCommentActionLeftSlot = (slot: React.JSX.Element | null) =>
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
