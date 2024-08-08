'use client'

import type { CommentModel } from '@mx-space/api-client'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { FC, PropsWithChildren } from 'react'
import { createContext, memo, useEffect, useMemo } from 'react'

import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { jotaiStore } from '~/lib/store'

import { setCommentActionLeftSlot, useCommentActionLeftSlot } from './hooks'

export const commentStoragePrefix = 'comment-'
export const createInitialValue = () => ({
  refId: atom(''),

  text: atom(''),
  author: atomWithStorage(`${commentStoragePrefix}author`, ''),
  mail: atomWithStorage(`${commentStoragePrefix}mail`, ''),
  url: atomWithStorage(`${commentStoragePrefix}url`, ''),

  avatar: atom(''),
  source: atom(''),

  // settings
  isWhisper: atomWithStorage(`${commentStoragePrefix}is-whisper`, false),
  syncToRecently: atomWithStorage(
    `${commentStoragePrefix}sync-to-recently`,
    true,
  ),
})
export const CommentBoxContext = createContext<
  ReturnType<typeof createInitialValue>
>(null!)

export const CommentBoxLifeCycleContext = createContext<{
  afterSubmit?: () => void
}>(null!)

export const CommentBoxProvider = (
  props: PropsWithChildren & {
    refId: string
    afterSubmit?: () => void
    initialValue?: string
  },
) => {
  const { refId, children, afterSubmit, initialValue } = props

  const ctxValue = useMemo(
    () => ({
      ...createInitialValue(),
      refId: atom(refId),
    }),
    [refId],
  )
  useBeforeMounted(() => {
    if (initialValue) {
      jotaiStore.set(ctxValue.text, initialValue)
    }
  })
  return (
    <CommentBoxContext.Provider key={refId} value={ctxValue}>
      <CommentBoxLifeCycleContext.Provider
        value={useMemo(() => ({ afterSubmit }), [afterSubmit])}
      >
        {children}
      </CommentBoxLifeCycleContext.Provider>
    </CommentBoxContext.Provider>
  )
}

export const CommentIsReplyContext = createContext(false)
export const CommentOriginalRefIdContext = createContext('')
export const CommentCompletedCallbackContext = createContext<
  null | ((comment: CommentModel) => void)
>(null)
export const CommentIsReplyProvider = (
  props: PropsWithChildren<{
    isReply: boolean
    originalRefId: string
    onCompleted?: (comment: CommentModel) => void
  }>,
) => {
  const { isReply, originalRefId, onCompleted, children } = props
  return (
    <CommentOriginalRefIdContext.Provider value={originalRefId}>
      <CommentIsReplyContext.Provider value={isReply}>
        <CommentCompletedCallbackContext.Provider value={onCompleted || null}>
          {children}
        </CommentCompletedCallbackContext.Provider>
      </CommentIsReplyContext.Provider>
    </CommentOriginalRefIdContext.Provider>
  )
}

export const CommentBoxSlotPortal = memo((props: PropsWithChildren) => {
  const { children } = props
  useEffect(() => {
    setCommentActionLeftSlot(children)
    return () => {
      setCommentActionLeftSlot(null)
    }
  }, [children])
  return null
})

export const CommentBoxSlotProvider: FC = memo(() => useCommentActionLeftSlot())

CommentBoxSlotProvider.displayName = 'CommentBoxSlotProvider'
CommentBoxSlotPortal.displayName = 'CommentBoxSlotPortal'
