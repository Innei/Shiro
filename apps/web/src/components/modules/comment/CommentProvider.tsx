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
import { useTranslations } from 'next-intl'
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
import {
  buildCommentTreeItem,
  type CommentThreadInfiniteData,
  type CommentThreadViewItem,
} from './thread'

const CommentReaderMapContext = createContext<Record<string, ReaderModel>>({})
const CommentListContext = createReactContext<
  PrimitiveAtom<Record<string, CommentThreadViewItem>>
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
      PaginateResult<CommentModel & { ref: string }> & {
        readers: Record<string, ReaderModel>
      }
    >,
    commentAtom: PrimitiveAtom<Record<string, CommentThreadViewItem>>,
  ) => ReactNode
}> = ({ children, refId }) => {
  const t = useTranslations('comment')
  const commentAtom = useRefValue(() =>
    atom({} as Record<string, CommentThreadViewItem>),
  )

  const { data, isLoading, fetchNextPage, hasNextPage } =
    useCommentsQuery(refId)

  useEffect(() => {
    if (!data) return
    const commentsMap = {} as Record<string, CommentThreadViewItem>
    function dts(comments: CommentThreadViewItem[]) {
      for (const comment of comments) {
        commentsMap[comment.id] = comment
        dts(comment.children)
      }
    }

    dts(
      (data as CommentThreadInfiniteData).pages.flatMap((page) =>
        page.data.map((comment) => buildCommentTreeItem(comment)),
      ),
    )

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
        <NotSupport text={t('no_comments_yet')} />
      </div>
    )

  return (
    <CommentReaderMapContext.Provider value={readers}>
      <CommentListContext.Provider value={commentAtom}>
        {children(data, commentAtom)}

        {hasNextPage && (
          <LoadMoreIndicator onLoading={fetchNextPage}>
            <CommentSkeleton />
          </LoadMoreIndicator>
        )}
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
  selector: (comment?: CommentThreadViewItem) => T,
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
