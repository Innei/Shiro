'use client'

import '~/components/modules/post'

import type { Pager } from '@mx-space/api-client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import type { FC } from 'react'

import { PostItemComposer } from '~/components/modules/post/PostItemComposer'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { Loading } from '~/components/ui/loading'
import { apiClient } from '~/lib/request'

export const PostLoadMore: FC<{ pagination: Pager }> = ({ pagination }) => {
  const initialPageParam = pagination

  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sortBy')
  const orderBy = searchParams.get('orderBy')
  const lang = searchParams.get('lang')
  const locale = useLocale()

  const preferredLang = lang === 'original' ? undefined : lang || locale

  const { fetchNextPage, hasNextPage, data, isLoading } = useInfiniteQuery({
    queryKey: [
      'post-list',
      sortBy,
      orderBy,
      preferredLang,
      initialPageParam.currentPage,
    ],
    queryFn: async ({ pageParam }) => {
      return await apiClient.post.getList(pageParam, 10, {
        sortBy: sortBy as any,
        sortOrder: orderBy === 'desc' ? -1 : 1,
        truncate: 310,
        lang: preferredLang,
      })
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

  if (!data || data.pages.length === 0) return null

  return (
    <>
      <ul>
        {data.pages.map((page) =>
          page.data.map((item, index) => (
            <PostItemComposer key={item.id} data={item} index={index} />
          )),
        )}
      </ul>

      {hasNextPage && <LoadMoreIndicator onLoading={fetchNextPage} />}
    </>
  )
}
