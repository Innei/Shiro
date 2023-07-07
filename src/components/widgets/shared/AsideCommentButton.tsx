import type { ModalContentComponent } from '~/providers/root/modal-stack-provider'

import { MotionButtonBase } from '~/components/ui/button'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useModalStack } from '~/providers/root/modal-stack-provider'

import { CommentBoxRoot } from '../comment/CommentBox'
import { Comments } from '../comment/Comments'

interface AsideCommentButtonProps {
  title: string
  refId: string
}

export const AsideCommentButton = (props: AsideCommentButtonProps) => {
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

const CommentModal: ModalContentComponent<AsideCommentButtonProps> = (
  props,
) => {
  const { refId, title, dismiss } = props

  return (
    <div className="max-w-95vw w-[700px] overflow-y-auto overflow-x-hidden">
      <span>
        回复： <h1 className="mt-4 text-lg font-medium">{title}</h1>
      </span>

      <CommentBoxRoot className="my-12" refId={refId} afterSubmit={dismiss} />

      <Comments refId={refId} />
    </div>
  )
}
