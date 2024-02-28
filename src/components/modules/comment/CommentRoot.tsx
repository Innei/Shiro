import type { FC } from 'react'
import type { CommentBaseProps } from './types'

import { LazyLoad } from '~/components/common/Lazyload'

import { CommentBoxRoot } from './CommentBox/Root'
import { Comments } from './Comments'
import { CommentSkeleton } from './CommentSkeleton'

export const CommentAreaRoot: FC<
  CommentBaseProps & {
    allowComment: boolean
  }
> = (props) => {
  // const header = headers()
  // const geo = header.get(REQUEST_GEO)

  // const isCN = geo === 'CN'

  // if (isCN) return <NotSupport />

  const { allowComment, refId } = props
  // 兜下后端的数据，默认开
  if (!allowComment && typeof allowComment !== 'undefined') {
    return (
      <p className="mt-[7.1rem] text-center text-xl font-medium">评论已关闭</p>
    )
  }

  return (
    <div className="relative mt-12">
      <CommentBoxRoot refId={refId} />

      <div className="h-12" />
      <LazyLoad placeholder={<CommentSkeleton />} triggerOnce>
        <Comments refId={refId} />
      </LazyLoad>
    </div>
  )
}
