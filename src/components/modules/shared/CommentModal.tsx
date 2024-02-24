import type { ModalContentComponent } from '~/components/ui/modal'

import { useCurrentModal } from '~/components/ui/modal'

import { CommentsLazy } from '../comment'
import { CommentBoxRoot } from '../comment/CommentBox'

export interface CommentModalProps {
  title: string
  refId: string

  initialValue?: string
}

export const CommentModal: ModalContentComponent<CommentModalProps> = (
  props,
) => {
  const { refId, title, initialValue } = props
  const { dismiss } = useCurrentModal()

  return (
    <div className="max-w-95vw overflow-y-auto overflow-x-hidden md:w-[500px] lg:w-[600px] xl:w-[700px]">
      <span>
        回复： <h1 className="mt-4 text-lg font-medium">{title}</h1>
      </span>

      <CommentBoxRoot
        initialValue={initialValue}
        className="mb-12 mt-6"
        refId={refId}
        afterSubmit={() => {
          // FIXME: framer motion bug, if re-render trigger and do dimiss same time, dom will don't remove after exit animation
          setTimeout(dismiss, 1000)
        }}
      />

      <CommentsLazy refId={refId} />
    </div>
  )
}
