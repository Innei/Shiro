import type { PostModel } from '@mx-space/api-client'

import { apiClient } from '~/lib/request'

import { defineQuery } from '../helper'

export const category = {
  // 获取某个分类下的文章列表（使用简单的单页请求）
  postsByCategory: (categorySlug: string) =>
    defineQuery({
      queryKey: ['category', 'posts', categorySlug],
      queryFn: async () => {
        // 先尝试获取第一页，看看有多少文章
        const result = await apiClient.post.getList(1, 50, {
          truncate: 0,
        })

        const allPosts = [...(result.data as PostModel[])]

        // 如果有更多页面，继续获取
        if (
          result.pagination?.hasNextPage &&
          result.pagination.totalPages > 1
        ) {
          const totalPages = Math.min(result.pagination.totalPages, 20) // 限制最多 20 页
          for (let page = 2; page <= totalPages; page++) {
            const nextPage = await apiClient.post.getList(page, 50, {
              truncate: 0,
            })
            allPosts.push(...(nextPage.data as PostModel[]))
          }
        }

        return allPosts.filter((post) => post.category?.slug === categorySlug)
      },
      gcTime: 1000 * 60 * 30,
      staleTime: 1000 * 60 * 10,
    }),
}
