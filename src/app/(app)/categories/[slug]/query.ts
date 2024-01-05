import { apiClient } from '~/lib/request'
import { defineQuery } from '~/queries/helper'

export const getPageBySlugQuery = (slug: string) =>
  defineQuery({
    queryKey: ['category', slug],
    queryFn: async ({ queryKey }) => {
      const [, slug] = queryKey

      const data = await apiClient.category.getCategoryByIdOrSlug(slug)

      return {
        ...data,
      }
    },
  })
