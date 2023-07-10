'use client'

import dynamic from 'next/dynamic'

import { LazyLoad } from '~/components/common/Lazyload'
import { Loading } from '~/components/ui/loading'

const LoadingElement = <Loading loadingText="评论区加载中..." />

const CommentAreaRoot = dynamic(
  () => import('./CommentRoot').then((mod) => mod.CommentAreaRoot),
  {
    ssr: false,
    loading: () => LoadingElement,
  },
)

export const CommentAreaRootLazy: typeof CommentAreaRoot = (props) => {
  return (
    <LazyLoad placeholder={LoadingElement}>
      <CommentAreaRoot {...props} />
    </LazyLoad>
  )
}
