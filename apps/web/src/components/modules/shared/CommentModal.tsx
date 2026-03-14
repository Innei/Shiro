import type { ModalContentComponent } from '~/components/ui/modal'
import { useCurrentModal } from '~/components/ui/modal'

import { CommentsLazy } from '../comment'
import { CommentBoxRoot } from '../comment/CommentBox'
import type { CommentAnchor } from '../comment/types'

export interface CommentModalProps {
  anchor?: CommentAnchor | null
  initialValue?: string

  refId: string
  title: string
}

export const CommentModal: ModalContentComponent<CommentModalProps> = (
  props,
) => {
  const { refId, title, initialValue, anchor } = props
  const { dismiss } = useCurrentModal()

  return (
    <div className="overflow-hidden md:w-[500px] lg:w-[600px] xl:w-[700px]">
      <span>
        回复： <h1 className="mt-4 text-lg font-medium">{title}</h1>
      </span>

      {anchor && anchor.mode === 'range' && (
        <blockquote className="my-3 border-l-2 border-accent/40 pl-3 text-sm italic text-neutral-7">
          {anchor.quote}
        </blockquote>
      )}

      {anchor && anchor.mode === 'block' && (
        <div className="my-3 text-sm text-neutral-7">
          <span>{`评论了「${anchor.snapshotText.slice(0, 60)}${anchor.snapshotText.length > 60 ? '…' : ''}」`}</span>
        </div>
      )}

      <CommentBoxRoot
        autoFocus
        anchor={anchor}
        className="mb-12 mt-6"
        initialValue={initialValue}
        refId={refId}
        afterSubmit={() => {
          setTimeout(dismiss, 1000)
        }}
      />

      <CommentsLazy refId={refId} />
    </div>
  )
}
