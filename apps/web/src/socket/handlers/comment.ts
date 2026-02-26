import type { CommentModel, PaginateResult } from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'

import { queryClient } from '~/providers/root/react-query-provider'
import { buildCommentsQueryKey } from '~/queries/keys'
import { EventTypes } from '~/types/events'

import type { EventHandler } from './types'

export const commentCreateHandler: EventHandler = (data) => {
  const payload = data as {
    ref: string
    id: string
  }

  setTimeout(() => {
    const queryData = queryClient.getQueryData<
      InfiniteData<PaginateResult<CommentModel>>
    >(buildCommentsQueryKey(payload.ref))

    if (!queryData) return
    for (const page of queryData.pages) {
      if (page.data.some((comment) => comment.id === payload.id)) {
        return
      }
    }

    queryClient.invalidateQueries({
      queryKey: buildCommentsQueryKey(payload.ref),
    })
  }, 1000)
}

export const commentHandlers = {
  [EventTypes.COMMENT_CREATE]: commentCreateHandler,
} as const
