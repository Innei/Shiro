import type { CommentModalProps } from './CommentModal'

import { MotionButtonBase } from '~/components/ui/button'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useModalStack } from '~/providers/root/modal-stack-provider'

import { CommentModal } from './CommentModal'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
      <i className="icon-[mingcute--comment-line] text-[24px] opacity-80 duration-200 hover:text-uk-pink-dark hover:opacity-100" />
    </MotionButtonBase>
  )
}
