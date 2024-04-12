import type {
  CommentModel,
  CommentState,
  PaginateResult,
} from '@mx-space/api-client'

import { apiClient } from '~/lib/request'

import { defineQuery } from '../helper'

export const commentAdmin = {
  byState: (state: CommentState) =>
    defineQuery({
      queryKey: ['comment', 'admin', state.toString()],
      queryFn: async ({ pageParam }: any) => {
        const response = await apiClient.proxy.comments.get<
          PaginateResult<CommentModel>
        >({
          params: {
            page: pageParam,
            size: 20,
            state: state | 0,
          },
        })

        return response
      },
    }),
}
