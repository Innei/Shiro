import '~/components/modules/post/PostItem'

import { NormalContainer } from '~/components/layout/container/Normal'
import { PostPagination } from '~/components/modules/post'
import { PostsSettingFab } from '~/components/modules/post/fab/PostsSettingsFab'
import { PostTagsFAB } from '~/components/modules/post/fab/PostTagsFAB'
import { PostItemComposer } from '~/components/modules/post/PostItemComposer'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { SearchFAB } from '~/components/modules/shared/SearchFAB'
import { BackToTopFAB } from '~/components/ui/fab'
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
export const revalidate = 600
export default definePrerenderPage<Props>()({
  fetcher: async (params) => {
    const { page, size, orderBy, sortBy } = params || {}
    const currentPage = page ? Number.parseInt(page) : 1
    const currentSize = size ? Number.parseInt(size) : 10

    return await apiClient.post.getList(currentPage, currentSize, {
      sortBy: sortBy as any,
      sortOrder: orderBy === 'desc' ? -1 : 1,
      truncate: 310,
    })
  },
  Component: async (props) => {
    const { params, fetchedAt } = props
    const { data, pagination } = props.data
    const { page } = params

    const currentPage = page ? Number.parseInt(page) : 1

    if (!data?.length) {
      return <NothingFound />
    }

    return (
      <NormalContainer>
        <PostListDataRevaildate fetchedAt={fetchedAt} />
        <ul data-fetch-at={fetchedAt}>
          {data.map((item, index) => (
            <PostItemComposer key={item.id} index={index} data={item} />
          ))}
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
