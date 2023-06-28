'use client'

import { createContext, useRef } from 'react'
import { atom } from 'jotai'
import type { CommentModel } from '@mx-space/api-client'
import type { PropsWithChildren } from 'react'

export const createInitialValue = () => ({
  refId: atom(''),

  text: atom(''),
  author: atom(''),
  mail: atom(''),
  url: atom(''),

  avatar: atom(''),
  source: atom(''),
})
export const CommentBoxContext = createContext(createInitialValue())
export const CommentBoxProvider = (
  props: PropsWithChildren & { refId: string },
) => {
  const { refId, children } = props
  return (
    <CommentBoxContext.Provider
      key={refId}
      value={
        useRef({
          ...createInitialValue(),
          refId: atom(refId),
        }).current
      }
    >
      {children}
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
