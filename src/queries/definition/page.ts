import { apiClient } from '~/lib/request'

import { defineQuery } from '../helper'

export const page = {
  bySlug: (slug: string) =>
    defineQuery({
      queryKey: ['page', slug],

      queryFn: async ({ queryKey }) => {
        const [, slug] = queryKey

        const data = await apiClient.page.getBySlug(slug)

        return data.$serialized
      },
    }),
}
