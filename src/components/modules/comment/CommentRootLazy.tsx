'use client'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'

import { CommentAreaRoot } from './CommentRoot'

export const CommentAreaRootLazy: typeof CommentAreaRoot = (props) => (
  <ErrorBoundary>
    <CommentAreaRoot {...props} />
  </ErrorBoundary>
)
