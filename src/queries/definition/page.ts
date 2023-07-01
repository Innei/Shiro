import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'

import { defineQuery } from '../helper'

export const page = {
  bySlug: (slug: string) =>
    defineQuery({
      queryKey: ['page', slug],
      meta: {
        hydrationRoutePath: routeBuilder(Routes.Page, {
          slug,
        }),
      },
      queryFn: async ({ queryKey }) => {
        const [, slug] = queryKey

        const data = await apiClient.page.getBySlug(slug)

        return data.$serialized
      },
    }),
}
