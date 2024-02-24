'use client'

import dynamic from 'next/dynamic'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { LazyLoad } from '~/components/common/Lazyload'
import { Loading } from '~/components/ui/loading'
import { isClientSide } from '~/lib/env'

const LoadingElement = (
  <Loading className="h-[824px]" loadingText="评论区加载中..." />
)

const CommentAreaRoot = dynamic(
  () => import('./CommentRoot').then((mod) => mod.CommentAreaRoot),
  {
    ssr: false,
    loading: () => LoadingElement,
  },
)

export const CommentAreaRootLazy: typeof CommentAreaRoot = (props) => {
  return (
    <ErrorBoundary>
      <LazyLoad
        placeholder={LoadingElement}
        triggerOnce
        offset={isClientSide ? window.innerHeight : 0}
      >
        <CommentAreaRoot {...props} />
      </LazyLoad>
    </ErrorBoundary>
  )
}
