'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { FC } from 'react'
import type { CommentBaseProps } from './types'

import { apiClient } from '~/utils/request'

import { Comment } from './Comment'
import { CommentSkeleton } from './CommentSkeleton'

export const Comments: FC<CommentBaseProps> = ({ refId }) => {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery(
    ['comments', refId],
    async ({ queryKey, meta }) => {
      const { page } = meta as { page: number }
      const [, refId] = queryKey as [string, string]
      const data = await apiClient.comment.getByRefId(refId, {
        page,
      })
      return data.$serialized
    },

    {
      meta: {
        page,
      },
    },
  )
  if (isLoading) {
    return <CommentSkeleton />
  }
  if (!data) return null
  return (
    <ul className="list-none space-y-4">
      {data.data.map((comment) => {
        return <Comment comment={comment} key={comment.id} />
      })}
    </ul>
  )
}
