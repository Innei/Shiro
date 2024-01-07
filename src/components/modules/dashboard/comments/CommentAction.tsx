import { useContext } from 'react'
import type { CommentModel } from '@mx-space/api-client'

import { CommentState } from '@mx-space/api-client'

import { MotionButtonBase } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'

import { DeleteConfirmButton } from '../../shared/DeleteConfirmButton'
import {
  CommentStateContext,
  useSetCommentSelectionKeys,
} from './CommentContext'
import { ReplyModal } from './ReplyModal'

export const CommentAction = (props: CommentModel) => {
  const currentState = useContext(CommentStateContext)

  const { id } = props

  const setSelectionKeys = useSetCommentSelectionKeys()

  const { present } = useModalStack()

  return (
    <div className="mt-2 flex items-center justify-end gap-4 lg:justify-start">
      {currentState === CommentState.Unread && (
        <MotionButtonBase className="text-primary" onClick={() => {}}>
          已读
        </MotionButtonBase>
      )}
      <MotionButtonBase
        className="text-orange-400 dark:text-orange-500"
        onClick={() => {
          present({
            title: `回复 ${props.author}`,
            content: () => <ReplyModal {...props} />,
            clickOutsideToDismiss: false,
          })
        }}
      >
        回复
      </MotionButtonBase>
      <DeleteConfirmButton onDelete={async () => {}} />
    </div>
  )
}
