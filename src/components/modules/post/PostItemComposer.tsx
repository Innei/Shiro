'use client'

import type { PostModel } from '@mx-space/api-client'

import 'jotai'

import type { FC } from 'react'

import { usePostViewMode } from './atom'
import { PostCompactItem, PostLooseItem } from './PostItem'

export const PostItemComposer: FC<{
  data: PostModel
}> = ({ data }) => {
  const renderedViewMode = usePostViewMode()

  return renderedViewMode === 'loose' ? (
    <PostLooseItem data={data} />
  ) : (
    <PostCompactItem data={data} />
  )
}
