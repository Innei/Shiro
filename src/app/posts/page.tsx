import { EmptyIcon } from '~/components/icons/empty'
import { NormalContainer } from '~/components/layout/container/Normal'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { PostItem } from '~/components/widgets/post/PostItem'
import { PostPagination } from '~/components/widgets/post/PostPagination'
import { apiClient } from '~/utils/request'

interface Props {
  searchParams: {
    page?: string
    size?: string
  }
}

export const metadata = {
  title: '文章列表',
}

export default async (props: Props) => {
  const { page, size } = props?.searchParams || {}
  const nextPage = page ? parseInt(page) : 1
  const nextSize = size ? parseInt(size) : 10

  const { $serialized } = await apiClient.post.getList(nextPage, nextSize)
  const { data, pagination } = $serialized

  if (!data?.length) {
    return (
      <NormalContainer className="flex h-[500px] flex-col space-y-4 center">
        <EmptyIcon />
        <p>这里空空如也</p>
        <p>稍后再来看看吧！</p>
      </NormalContainer>
    )
  }
  return (
    <NormalContainer>
      <ul>
        {data.map((item, index) => {
          return (
            <BottomToUpTransitionView key={item.id} as="li" delay={index * 100}>
              <PostItem data={item} />
            </BottomToUpTransitionView>
          )
        })}
      </ul>

      <PostPagination pagination={pagination} />
    </NormalContainer>
  )
}
