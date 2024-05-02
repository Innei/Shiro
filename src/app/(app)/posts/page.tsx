/* eslint-disable react/display-name */
import { NormalContainer } from '~/components/layout/container/Normal'
import { PostsSettingFab } from '~/components/modules/post/fab/PostsSettingsFab'
import { PostTagsFAB } from '~/components/modules/post/fab/PostTagsFAB'
import {
  PostCompactItem,
  PostLooseItem,
} from '~/components/modules/post/PostItem'
import { PostPagination } from '~/components/modules/post/PostPagination'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { SearchFAB } from '~/components/modules/shared/SearchFAB'
import { BackToTopFAB } from '~/components/ui/fab'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { OnlyDesktop } from '~/components/ui/viewport'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

import { PostListDataRevaildate } from './data-revalidate'
import { PostLoadMore } from './loader'

interface Props {
  page?: string
  size?: string
  sortBy?: string
  orderBy?: string
  view_mode?: string
}

export const metadata = {
  title: '文章列表',
}

export const dynamic = 'force-dynamic'

export default definePrerenderPage<Props>()({
  fetcher: async (params) => {
    const { page, size, orderBy, sortBy } = params || {}
    const currentPage = page ? parseInt(page) : 1
    const currentSize = size ? parseInt(size) : 10

    return await apiClient.post.getList(currentPage, currentSize, {
      sortBy: sortBy as any,
      sortOrder: orderBy === 'desc' ? -1 : 1,
      truncate: 310,
    })
  },
  Component: async (props) => {
    const { params, fetchedAt } = props
    const { data, pagination } = props.data
    const { page, view_mode = 'loose' } = params

    const currentPage = page ? parseInt(page) : 1

    if (!data?.length) {
      return <NothingFound />
    }
    return (
      <NormalContainer>
        <PostListDataRevaildate fetchedAt={fetchedAt} />
        <ul data-fetch-at={fetchedAt}>
          {data.map((item, index) => {
            return (
              <BottomToUpTransitionView
                lcpOptimization
                key={item.id}
                as="li"
                delay={index * 100}
              >
                {view_mode === 'loose' ? (
                  <PostLooseItem data={item} />
                ) : (
                  <PostCompactItem data={item} />
                )}
              </BottomToUpTransitionView>
            )
          })}
        </ul>

        {currentPage > 1 ? (
          <PostPagination pagination={pagination} />
        ) : (
          pagination.hasNextPage && <PostLoadMore pagination={pagination} />
        )}

        <PostsSettingFab />
        <PostTagsFAB />
        <SearchFAB />
        <OnlyDesktop>
          <BackToTopFAB />
        </OnlyDesktop>
      </NormalContainer>
    )
  },
})
