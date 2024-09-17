import type { ReaderModel } from '@mx-space/api-client'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'

const CommentReaderMapContext = createContext<Record<string, ReaderModel>>({})
export const CommentProvider: FC<
  PropsWithChildren<{
    readers: Record<string, ReaderModel>
  }>
> = ({ children, readers }) => {
  return (
    <CommentReaderMapContext.Provider value={readers}>
      {children}
    </CommentReaderMapContext.Provider>
  )
}

export const useCommentReader = (readerId?: string) => {
  return useContextSelector(CommentReaderMapContext, (v) =>
    readerId ? v[readerId] : undefined,
  )
}
