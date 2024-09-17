import type { CommentModel, ReaderModel } from '@mx-space/api-client'
import { useLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import type { PrimitiveAtom } from 'jotai'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { FC, PropsWithChildren } from 'react'
import {
  createContext as createReactContext,
  useCallback,
  useContext as useReactContext,
  useMemo,
} from 'react'
import { createContext, useContextSelector } from 'use-context-selector'

import { useRefValue } from '~/hooks/common/use-ref-value'
import { jotaiStore } from '~/lib/store'

const CommentReaderMapContext = createContext<Record<string, ReaderModel>>({})
const CommentListContext = createReactContext<
  PrimitiveAtom<Record<string, CommentModel & { new?: boolean }>>
>(atom({}))
export const CommentProvider: FC<
  PropsWithChildren<{
    readers: Record<string, ReaderModel>
    comments: (CommentModel & { new?: boolean })[]
  }>
> = ({ children, readers, comments }) => {
  const commentAtom = useRefValue(() =>
    atom({} as Record<string, CommentModel & { new?: boolean }>),
  )

  useLayoutEffect(() => {
    const commentsMap = {} as Record<string, CommentModel & { new?: boolean }>
    function dts(comments: CommentModel[]) {
      for (const comment of comments) {
        commentsMap[comment.id] = comment

        if (comment.children) {
          dts(comment.children)
        }
      }
    }

    dts(comments)

    jotaiStore.set(commentAtom, commentsMap)
  }, [commentAtom, comments])

  return (
    <CommentReaderMapContext.Provider value={readers}>
      <CommentListContext.Provider value={commentAtom}>
        {children}
      </CommentListContext.Provider>
    </CommentReaderMapContext.Provider>
  )
}

export const useCommentReader = (readerId?: string) => {
  return useContextSelector(CommentReaderMapContext, (v) =>
    readerId ? v[readerId] : undefined,
  )
}

export const useCommentByIdSelector = <T,>(
  commentId: string,
  selector: (comment?: CommentModel) => T,
): T => {
  const commentsAtom = useReactContext(CommentListContext)
  return useAtomValue(
    useMemo(
      () => selectAtom(commentsAtom, (v) => selector(v[commentId])),
      [commentsAtom, selector, commentId],
    ),
  )
}

export const useCommentById = (commentId: string) => {
  const commentsAtom = useReactContext(CommentListContext)
  return useAtomValue(
    useMemo(
      () => selectAtom(commentsAtom, (v) => v[commentId]),
      [commentsAtom, commentId],
    ),
  )
}

export const useUpdateComment = () => {
  const commentsAtom = useReactContext(CommentListContext)
  return useCallback(
    (comment: Partial<CommentModel> & { id: string }) => {
      jotaiStore.set(commentsAtom, (prev) => {
        const newComments = {
          ...prev,
          [comment.id]: { ...prev[comment.id], ...comment },
        }
        return newComments
      })
    },
    [commentsAtom],
  )
}
