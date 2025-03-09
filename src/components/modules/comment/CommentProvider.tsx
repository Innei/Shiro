import type {
  CommentModel,
  PaginateResult,
  ReaderModel,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import { createContextState } from 'foxact/create-context-state'
import type { PrimitiveAtom } from 'jotai'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { FC, ReactNode } from 'react'
import {
  createContext as createReactContext,
  use,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { createContext, useContextSelector } from 'use-context-selector'

import { NotSupport } from '~/components/common/NotSupport'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { jotaiStore } from '~/lib/store'

import { LoadMoreIndicator } from '../shared/LoadMoreIndicator'
import { CommentSkeleton } from './CommentSkeleton'
import { useCommentsQuery } from './hooks'

const CommentReaderMapContext = createContext<Record<string, ReaderModel>>({})
const CommentListContext = createReactContext<
  PrimitiveAtom<Record<string, CommentModel & { new?: boolean }>>
>(null!)

export const [
  CommentMarkdownContainerRefContext,
  useCommentMarkdownContainerRef,
  useCommentMarkdownContainerRefSetter,
] = createContextState<HTMLDivElement | null>(null)

export const CommentProvider: FC<{
  refId: string
  children: (
    data: InfiniteData<
      PaginateResult<
        CommentModel & {
          ref: string
        }
      > & {
        readers: Record<string, ReaderModel>
      }
    >,
    commentAtom: PrimitiveAtom<
      Record<string, CommentModel & { new?: boolean }>
    >,
  ) => ReactNode
}> = ({ children, refId }) => {
  const commentAtom = useRefValue(() =>
    atom({} as Record<string, CommentModel & { new?: boolean }>),
  )

  const { data, isLoading, fetchNextPage, hasNextPage } =
    useCommentsQuery(refId)

  useEffect(() => {
    if (!data) return
    const commentsMap = Object.assign({}, jotaiStore.get(commentAtom))
    function dts(comments: CommentModel[]) {
      for (const comment of comments) {
        commentsMap[comment.id] = comment

        if (comment.children) {
          dts(comment.children)
        }
      }
    }

    dts(data.pages.flatMap((page) => page.data))

    jotaiStore.set(commentAtom, commentsMap)
  }, [commentAtom, data])

  const readers = useMemo(() => {
    if (!data) return {}
    return data?.pages.reduce(
      (acc, curr) => ({ ...acc, ...curr.readers }),
      {} as Record<string, ReaderModel>,
    )
  }, [data])

  if (isLoading) {
    return <CommentSkeleton />
  }
  if (!data || data.pages.length === 0 || data.pages[0].data.length === 0)
    return (
      <div className="center flex min-h-[400px]">
        <NotSupport text="这里还没有评论呢" />
      </div>
    )

  return (
    <CommentReaderMapContext.Provider value={readers}>
      <CommentListContext value={commentAtom}>
        {children(data, commentAtom)}

        {hasNextPage && (
          <LoadMoreIndicator onLoading={fetchNextPage}>
            <CommentSkeleton />
          </LoadMoreIndicator>
        )}
      </CommentListContext>
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
  const commentsAtom = use(CommentListContext)
  return useAtomValue(
    useMemo(
      () => selectAtom(commentsAtom, (v) => selector(v[commentId])),
      [commentsAtom, selector, commentId],
    ),
  )
}

export const useCommentById = (commentId: string) => {
  const commentsAtom = use(CommentListContext)
  return useAtomValue(
    useMemo(
      () => selectAtom(commentsAtom, (v) => v[commentId]),
      [commentsAtom, commentId],
    ),
  )
}

export const useUpdateComment = () => {
  const commentsAtom = use(CommentListContext)
  return useCallback(
    (comment: Partial<CommentModel> & { id: string }) => {
      jotaiStore.set(commentsAtom, (prev) => {
        const newComments = {
          ...prev,
          [comment.id]: {
            ...prev[comment.id],
            ...comment,
            editedAt: new Date().toISOString(),
          },
        }

        return newComments
      })
    },
    [commentsAtom],
  )
}
