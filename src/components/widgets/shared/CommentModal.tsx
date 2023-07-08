import type { ModalContentComponent } from '~/providers/root/modal-stack-provider'

import { CommentBoxRoot } from '../comment/CommentBox'
import { Comments } from '../comment/Comments'

export interface CommentModalProps {
  title: string
  refId: string

  initialValue?: string
}

export const CommentModal: ModalContentComponent<CommentModalProps> = (
  props,
) => {
  const { refId, title, dismiss, initialValue } = props

  return (
    <div className="max-w-95vw w-[700px] overflow-y-auto overflow-x-hidden">
      <span>
        回复： <h1 className="mt-4 text-lg font-medium">{title}</h1>
      </span>

      <CommentBoxRoot
        initialValue={initialValue}
        className="my-12"
        refId={refId}
        afterSubmit={dismiss}
      />

      <Comments refId={refId} />
    </div>
  )
}
