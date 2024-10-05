import { MotionButtonBase } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'
import { useIsClient } from '~/hooks/common/use-is-client'

import { ActionAsideIcon } from './ActionAsideContainer'
import type { CommentModalProps } from './CommentModal'
import { CommentModal } from './CommentModal'

export interface AsideCommentButtonProps {}

export const AsideCommentButton = (
  props: CommentModalProps & AsideCommentButtonProps,
) => {
  const isClient = useIsClient()
  const { present } = useModalStack()

  if (!isClient) return null

  return (
    <MotionButtonBase
      aria-label="Comment For This Post"
      className="flex flex-col space-y-2"
      onClick={() => {
        present({
          title: '评论',
          content: (rest) => <CommentModal {...props} {...rest} />,
        })
      }}
    >
      <ActionAsideIcon className="i-mingcute-comment-line hover:text-uk-pink-dark" />
    </MotionButtonBase>
  )
}
