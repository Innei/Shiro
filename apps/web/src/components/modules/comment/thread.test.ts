import type {
  CollectionRefTypes,
  CommentModel,
  CommentThreadItem,
  PaginateResult,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import { buildCommentTreeItem, mergeThreadRepliesIntoPages } from './thread'

const makeComment = (
  id: string,
  created: string,
  overrides: Partial<CommentModel> = {},
): CommentModel => ({
  id,
  created,
  refType: 'posts' as CollectionRefTypes,
  ref: 'post-id',
  state: 1,
  author: `author-${id}`,
  text: `text-${id}`,
  avatar: '',
  ...overrides,
})

describe('comment thread helpers', () => {
  it('rebuilds nested children from flat replies using parentCommentId', () => {
    const root: CommentThreadItem = {
      ...makeComment('root', '2026-03-14T10:00:00.000Z', {
        parentCommentId: null,
        rootCommentId: null,
      }),
      replies: [
        makeComment('child-2', '2026-03-14T10:03:00.000Z', {
          parentCommentId: 'child-1',
          rootCommentId: 'root',
        }),
        makeComment('child-1', '2026-03-14T10:01:00.000Z', {
          parentCommentId: 'root',
          rootCommentId: 'root',
        }),
        makeComment('orphan', '2026-03-14T10:02:00.000Z', {
          parentCommentId: 'missing-parent',
          rootCommentId: 'root',
        }),
      ],
      replyWindow: {
        total: 3,
        returned: 3,
        threshold: 20,
        hasHidden: false,
        hiddenCount: 0,
      },
    }

    const tree = buildCommentTreeItem(root)

    expect(tree.children.map((comment) => comment.id)).toEqual([
      'child-1',
      'orphan',
    ])
    expect(tree.children[0]?.children.map((comment) => comment.id)).toEqual([
      'child-2',
    ])
  })

  it('merges loaded middle replies back into paginated thread data', () => {
    const root: CommentThreadItem & { ref: string } = {
      ...makeComment('root', '2026-03-14T10:00:00.000Z', {
        parentCommentId: null,
        rootCommentId: null,
      }),
      ref: 'post-id',
      replies: [
        makeComment('child-1', '2026-03-14T10:01:00.000Z', {
          parentCommentId: 'root',
          rootCommentId: 'root',
        }),
        makeComment('child-3', '2026-03-14T10:03:00.000Z', {
          parentCommentId: 'root',
          rootCommentId: 'root',
        }),
      ],
      replyWindow: {
        total: 3,
        returned: 2,
        threshold: 20,
        hasHidden: true,
        hiddenCount: 1,
        nextCursor: 'cursor-1',
      },
    }

    const data = {
      pageParams: [1],
      pages: [
        {
          data: [root],
          pagination: {
            currentPage: 1,
            totalPage: 1,
            hasPrevPage: false,
            hasNextPage: false,
            size: 10,
            total: 1,
          },
        },
      ],
    } satisfies InfiniteData<
      PaginateResult<CommentThreadItem & { ref: string }>
    >

    const next = mergeThreadRepliesIntoPages(data, {
      rootCommentId: 'root',
      replies: [
        makeComment('child-2', '2026-03-14T10:02:00.000Z', {
          parentCommentId: 'child-1',
          rootCommentId: 'root',
        }),
      ],
      replyWindow: {
        total: 3,
        returned: 3,
        threshold: 20,
        hasHidden: false,
        hiddenCount: 0,
      },
    })

    expect(
      next.pages[0]?.data[0]?.replies.map((comment) => comment.id),
    ).toEqual(['child-1', 'child-2', 'child-3'])
    expect(next.pages[0]?.data[0]?.replyWindow.hasHidden).toBe(false)
  })
})
