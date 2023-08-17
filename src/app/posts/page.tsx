import { NormalContainer } from '~/components/layout/container/Normal'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { PostsSortingFab } from '~/components/widgets/post/fab/PostsSortingFab'
import { PostTagsFAB } from '~/components/widgets/post/fab/PostTagsFAB'
import { PostItem } from '~/components/widgets/post/PostItem'
import { PostPagination } from '~/components/widgets/post/PostPagination'
import { NothingFound } from '~/components/widgets/shared/NothingFound'
import { SearchFAB } from '~/components/widgets/shared/SearchFAB'
import { apiClient } from '~/lib/request'

interface Props {
  searchParams: {
    page?: string
    size?: string
    sortBy?: string
    orderBy?: string
  }
}

export const metadata = {
  title: '文章列表',
}

export default async (props: Props) => {
  const { page, size, orderBy, sortBy } = props?.searchParams || {}
  const nextPage = page ? parseInt(page) : 1
  const nextSize = size ? parseInt(size) : 10

  const { $serialized } = await apiClient.post.getList(nextPage, nextSize, {
    sortBy: sortBy as any,
    sortOrder: orderBy === 'desc' ? -1 : 1,
  })
  const { data, pagination } = $serialized

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
    </NormalContainer>
  )
}
