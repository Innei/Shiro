import type {
  CommentModel,
  CommentReplyWindow,
  CommentThreadItem,
  PaginateResult,
  ReaderModel,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'

import type { CommentAnchor } from './types'

export type CommentWithAnchor = CommentModel & {
  anchor?: CommentAnchor
  new?: boolean
}

export type CommentThreadViewItem = CommentWithAnchor & {
  children: CommentThreadViewItem[]
  replies?: CommentWithAnchor[]
  replyWindow?: CommentReplyWindow
}

export type CommentThreadPage = PaginateResult<
  CommentThreadItem & { ref: string }
>
export type CommentThreadInfiniteData = InfiniteData<
  CommentThreadPage & {
    readers?: Record<string, ReaderModel>
  }
>

const toTimestamp = (date: string) => new Date(date).getTime()

const byCreatedAsc = (
  a: Pick<CommentModel, 'created'>,
  b: Pick<CommentModel, 'created'>,
) => toTimestamp(a.created) - toTimestamp(b.created)

const getParentCommentId = (
  parentCommentId: CommentModel['parentCommentId'],
) => {
  if (!parentCommentId) return null
  if (typeof parentCommentId === 'string') return parentCommentId
  return null
}

const createViewComment = (
  comment: CommentWithAnchor,
): CommentThreadViewItem => ({
  ...comment,
  children: [],
})

const sortChildrenDeep = (comment: CommentThreadViewItem) => {
  comment.children.sort(byCreatedAsc)
  for (const child of comment.children) {
    sortChildrenDeep(child)
  }
}

export const buildCommentTreeItem = (
  rootComment: CommentThreadItem | (CommentThreadViewItem & { ref?: string }),
): CommentThreadViewItem => {
  const rootView = createViewComment(rootComment)
  const replyViews = (rootComment.replies ?? []).map((reply) =>
    createViewComment(reply),
  )

  const commentMap = new Map<string, CommentThreadViewItem>([
    [rootView.id, rootView],
    ...replyViews.map((reply) => [reply.id, reply] as const),
  ])

  for (const reply of replyViews.sort(byCreatedAsc)) {
    const parentId = getParentCommentId(reply.parentCommentId)
    const parent = (parentId && commentMap.get(parentId)) || rootView
    parent.children.push(reply)
  }

  sortChildrenDeep(rootView)

  return {
    ...rootView,
    replies: dedupeRepliesById(rootComment.replies ?? []),
    replyWindow: rootComment.replyWindow,
  }
}

export const flattenThreadComments = (
  comments: Array<
    CommentThreadItem | (CommentThreadViewItem & { ref?: string })
  >,
): CommentWithAnchor[] => {
  const result: CommentWithAnchor[] = []
  for (const comment of comments) {
    result.push(comment)
    if (comment.replies) {
      result.push(...comment.replies)
    }
  }
  return dedupeRepliesById(result)
}

export const dedupeRepliesById = <T extends Pick<CommentModel, 'id'>>(
  comments: readonly T[],
): T[] => {
  const seen = new Set<string>()
  const result: T[] = []
  for (const comment of comments) {
    if (seen.has(comment.id)) continue
    seen.add(comment.id)
    result.push(comment)
  }
  return result
}

export const mergeThreadRepliesIntoPages = (
  data: CommentThreadInfiniteData,
  {
    rootCommentId,
    replies,
    replyWindow,
  }: {
    rootCommentId: string
    replies: CommentWithAnchor[]
    replyWindow: CommentReplyWindow
  },
): CommentThreadInfiniteData => ({
  ...data,
  pages: data.pages.map((page) => ({
    ...page,
    data: page.data.map((comment) => {
      if (comment.id !== rootCommentId) return comment

      return {
        ...comment,
        replies: dedupeRepliesById([
          ...(comment.replies ?? []),
          ...replies,
        ]).sort(byCreatedAsc),
        replyWindow,
      }
    }),
  })),
})
