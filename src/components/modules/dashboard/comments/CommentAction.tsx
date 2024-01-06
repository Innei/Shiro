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
    <div className="flex items-center justify-end space-x-4 lg:justify-start">
      {currentState === CommentState.Unread && (
        <MotionButtonBase color="primary" onClick={() => {}}>
          已读
        </MotionButtonBase>
      )}
      <MotionButtonBase
        color="secondary"
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
