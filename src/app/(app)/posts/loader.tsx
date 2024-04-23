'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import type { Pager } from '@mx-space/api-client'
import type { FC } from 'react'

import { PostCompactItem, PostLooseItem } from '~/components/modules/post'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { Loading } from '~/components/ui/loading'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { apiClient } from '~/lib/request'

export const PostLoadMore: FC<{ pagination: Pager }> = ({ pagination }) => {
  const initialPageParam = pagination

  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sortBy')
  const orderBy = searchParams.get('orderBy')

  const viewMode = searchParams.get('view_mode') || 'loose'
  const { fetchNextPage, hasNextPage, data, isLoading } = useInfiniteQuery({
    queryKey: ['post-list', sortBy, orderBy, initialPageParam.currentPage],
    queryFn: async ({ pageParam }) => {
      const data = await apiClient.post.getList(pageParam, 10, {
        sortBy: sortBy as any,
        sortOrder: orderBy === 'desc' ? -1 : 1,
      })
      return data
    },
    initialPageParam: initialPageParam.currentPage + 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    enabled: !!initialPageParam.hasNextPage,
  })

  if (isLoading && initialPageParam.hasNextPage) {
    return <Loading useDefaultLoadingText />
  }

  if (!data || !data.pages.length) return null

  return (
    <>
      <ul>
        {data.pages.map((page) => {
          return page.data.map((item, index) => {
            return (
              <BottomToUpTransitionView
                lcpOptimization
                key={item.id}
                as="li"
                delay={index * 100}
              >
                {viewMode === 'loose' ? (
                  <PostLooseItem data={item} />
                ) : (
                  <PostCompactItem data={item} />
                )}
              </BottomToUpTransitionView>
            )
          })
        })}
      </ul>

      {hasNextPage && <LoadMoreIndicator onLoading={fetchNextPage} />}
    </>
  )
}
