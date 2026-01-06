'use client'

import dynamic from 'next/dynamic'
import { createElement } from 'react'

import { Loading } from '~/components/ui/loading'

export const CommentsLazy = dynamic(
  () => import('./Comments').then((mod) => mod.Comments),
  { ssr: false },
)
export const CommentBoxRootLazy = dynamic(
  () => import('./CommentBox').then((mod) => mod.CommentBoxRoot),
  {
    ssr: false,
    loading: () => createElement(Loading, { useDefaultLoadingText: true }),
  },
)

export { CommentAreaRootLazy } from './CommentRootLazy'
