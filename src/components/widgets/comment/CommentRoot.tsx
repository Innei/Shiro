import type { FC } from 'react'
import type { CommentBaseProps } from './types'

import { LazyLoad } from '~/components/common/Lazyload'
import { Loading } from '~/components/ui/loading'

import { CommentBox } from './CommentBox'
import { Comments } from './Comments'

const LoadingElement = <Loading loadingText="评论区加载中..." />
export const CommentRoot: FC<CommentBaseProps> = (props) => {
  return (
    <LazyLoad placeholder={LoadingElement}>
      <div className="mt-12">
        <CommentBox refId={props.refId} />

        <div className="h-12" />
        <Comments refId={props.refId} />
      </div>
    </LazyLoad>
  )
}
