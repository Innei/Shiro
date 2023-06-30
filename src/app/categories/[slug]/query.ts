import { defineQuery } from '~/queries/helper'
import { apiClient } from '~/utils/request'

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
