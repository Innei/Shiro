import type { FC } from 'react'
import type { CommentBaseProps } from './types'

import { LazyLoad } from '~/components/common/Lazyload'
import { Loading } from '~/components/ui/loading'

import { CommentBoxRoot } from './CommentBox/CommentBoxRoot'
import { Comments } from './Comments'

const LoadingElement = <Loading loadingText="评论区加载中..." />
export const CommentAreaRoot: FC<CommentBaseProps> = (props) => {
  return (
    <LazyLoad placeholder={LoadingElement}>
      <div className="mt-12">
        <CommentBoxRoot refId={props.refId} />

        <div className="h-12" />
        <Comments refId={props.refId} />
      </div>
    </LazyLoad>
  )
}
