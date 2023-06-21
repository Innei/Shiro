import { EmptyIcon } from '~/components/icons/empty'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { PostPagination } from '~/components/widgets/post/PostPagination'
import { clsxm } from '~/utils/helper'
import { apiClient } from '~/utils/request'

import { PostItem } from '../../components/widgets/post/PostItem'

interface Props {
  searchParams: {
    page?: string
    size?: string
  }
}

export const metadata = {
  title: '文章列表',
}

const containerClassName =
  'mx-auto mt-12 max-w-4xl px-2 md:mt-[120px] md:px-0 lg:px-8'

export default async (props: Props) => {
  const { page, size } = props?.searchParams || {}
  const nextPage = page ? parseInt(page) : 1
  const nextSize = size ? parseInt(size) : 10

  const { $serialized } = await apiClient.post.getList(nextPage, nextSize)
  const { data, pagination } = $serialized

  if (!data?.length) {
    return (
      <div
        className={clsxm(
          containerClassName,
          'flex h-[500px] flex-col space-y-4 center',
        )}
      >
        <EmptyIcon />
        <p>这里空空如也</p>
        <p>稍后再来看看吧！</p>
      </div>
    )
  }
  return (
    <div className={containerClassName}>
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
    </div>
  )
}
