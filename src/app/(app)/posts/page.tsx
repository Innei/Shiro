/* eslint-disable react/display-name */
import { NormalContainer } from '~/components/layout/container/Normal'
import { PostsSortingFab } from '~/components/modules/post/fab/PostsSortingFab'
import { PostTagsFAB } from '~/components/modules/post/fab/PostTagsFAB'
import { PostItem } from '~/components/modules/post/PostItem'
import { PostPagination } from '~/components/modules/post/PostPagination'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { SearchFAB } from '~/components/modules/shared/SearchFAB'
import { BackToTopFAB } from '~/components/ui/fab'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { OnlyDesktop } from '~/components/ui/viewport'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

interface Props {
  page?: string
  size?: string
  sortBy?: string
  orderBy?: string
}

export const metadata = {
  title: '文章列表',
}

export default definePrerenderPage<Props>()({
  fetcher: async (params) => {
    const { page, size, orderBy, sortBy } = params || {}
    const currentPage = page ? parseInt(page) : 1
    const currentSize = size ? parseInt(size) : 10

    return await apiClient.post.getList(currentPage, currentSize, {
      sortBy: sortBy as any,
      sortOrder: orderBy === 'desc' ? -1 : 1,
    })
  },
  Component: async (props) => {
    const { params } = props
    const { data, pagination } = props.data
    const { page } = params

    const currentPage = page ? parseInt(page) : 1

    if (!data?.length) {
      return <NothingFound />
    }
    return (
      <NormalContainer>
        <ul>
          {data.map((item, index) => {
            return (
              <BottomToUpTransitionView
                lcpOptimization
                key={item.id}
                as="li"
                delay={index * 100}
              >
                <PostItem data={item} />
              </BottomToUpTransitionView>
            )
          })}
        </ul>

        <PostPagination pagination={pagination} />

        <PostsSortingFab />
        <PostTagsFAB />
        <SearchFAB />
        <OnlyDesktop>
          <BackToTopFAB />
        </OnlyDesktop>
      </NormalContainer>
    )
  },
})
