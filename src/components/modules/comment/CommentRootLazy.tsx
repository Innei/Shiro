'use client'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'

import { CommentAreaRoot } from './CommentRoot'

export const CommentAreaRootLazy: typeof CommentAreaRoot = (props) => {
  return (
    <ErrorBoundary>
      <CommentAreaRoot {...props} />
    </ErrorBoundary>
  )
}
