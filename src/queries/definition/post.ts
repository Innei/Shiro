import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'

import { defineQuery } from '../helper'

export const post = {
  bySlug: (category: string, slug: string) =>
    defineQuery({
      queryKey: ['post', category, slug],
      meta: {
        hydrationRoutePath: routeBuilder(Routes.Post, {
          category,
          slug,
        }),
      },
      queryFn: async ({ queryKey }) => {
        const [, category, slug] = queryKey

        const data = await apiClient.post.getPost(category, slug)

        return data.$serialized
      },
    }),
}

export const postAdmin = {
  paginate: (page: number) =>
    defineQuery({
      queryKey: ['postAdmin', 'paginate', page],
      queryFn: async ({ queryKey }) => {
        const data = await apiClient.post.getList(page)

        return data.$serialized
      },
    }),
}
