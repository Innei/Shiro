import type { CommentModel } from '@mx-space/api-client'
import { useQueryClient } from '@tanstack/react-query'
import type { SVGProps } from 'react'

import { apiClient } from '~/lib/request'
import { buildCommentsQueryKey } from '~/queries/keys'

import { PinIconToggle } from '../shared/PinIconToggle'
import { useCommentBoxRefIdValue } from './CommentBox/hooks'
import { useUpdateComment } from './CommentProvider'

export const CommentPinButton = ({ comment }: { comment: CommentModel }) => {
  const updateCommentUI = useUpdateComment()
  const queryClient = useQueryClient()
  const refId = useCommentBoxRefIdValue()
  if (comment.parent) return null
  return (
    <PinIconToggle
      pin={!!comment.pin}
      onPinChange={async (nextPin) => {
        updateCommentUI({
          id: comment.id,
          pin: nextPin,
        })

        await apiClient.comment
          .proxy(comment.id)
          .patch({
            data: {
              pin: nextPin,
            },
          })
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: buildCommentsQueryKey(refId),
            })
          })
      }}
    />
  )
}

export function OcticonGistSecret(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0.88em"
      height="1em"
      viewBox="0 0 14 16"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M8 10.5L9 14H5l1-3.5L5.25 9h3.5L8 10.5zM10 6H4L2 7h10l-2-1zM9 2L7 3L5 2L4 5h6L9 2zm4.03 7.75L10 9l1 2l-2 3h3.22c.45 0 .86-.31.97-.75l.56-2.28c.14-.53-.19-1.08-.72-1.22zM4 9l-3.03.75c-.53.14-.86.69-.72 1.22l.56 2.28c.11.44.52.75.97.75H5l-2-3l1-2z"
        fill="currentColor"
      />
    </svg>
  )
}
