import { CommentState } from '@mx-space/api-client'
import { useSearchParams } from 'next/navigation'

import { RoundedIconButton, StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { useModalStack } from '~/components/ui/modal/stacked/provider'
import { toast } from '~/lib/toast'
import {
  useDeleteCommentMutation,
  useUpdateCommentStateMutation,
} from '~/queries/hooks/comment'

import { OffsetHeaderLayout } from '../layouts'
import {
  useCommentSelectionKeys,
  useSetCommentSelectionKeys,
} from './CommentContext'

export const CommentBatchActionGroup = () => {
  const selectionKeys = useCommentSelectionKeys()
  const setSelectionKeys = useSetCommentSelectionKeys()

  const { mutateAsync: updateCommentState } = useUpdateCommentStateMutation()
  const { mutateAsync: deleteCommentState } = useDeleteCommentMutation()

  const batchChangeState = async (newState: CommentState) => {
    const ids = Array.from(selectionKeys)

    Promise.all(
      ids.map((id) => updateCommentState({ id, state: newState })),
    ).then(() => {
      setSelectionKeys(new Set())
      toast.success('操作已经成功')
    })
  }
  const batchDelete = async () => {
    const ids = Array.from(selectionKeys)

    Promise.all(ids.map((id) => deleteCommentState({ id }))).then(() => {
      setSelectionKeys(new Set())
      toast.success('操作已经成功')
    })
  }
  const search = useSearchParams()
  const tab =
    (Number.parseInt(search.get('tab')!) as any as CommentState) ||
    CommentState.Unread

  const { present } = useModalStack()

  if (selectionKeys.size === 0) return null
  return (
    <OffsetHeaderLayout className="hidden gap-4 lg:flex">
      {tab !== CommentState.Read && (
        <FloatPopover
          type="tooltip"
          placement="bottom"
          triggerElement={
            <RoundedIconButton
              onClick={() => {
                batchChangeState(CommentState.Read)
              }}
            >
              <i className="i-mingcute-check-fill size-5" />
            </RoundedIconButton>
          }
        >
          已读
        </FloatPopover>
      )}

      {tab !== CommentState.Junk && (
        <FloatPopover
          type="tooltip"
          placement="bottom"
          triggerElement={
            <RoundedIconButton
              className="bg-yellow-400 dark:bg-orange-500"
              onClick={() => {
                batchChangeState(CommentState.Junk)
              }}
            >
              <i className="i-mingcute-delete-2-line size-5" />
            </RoundedIconButton>
          }
        >
          垃圾
        </FloatPopover>
      )}
      <FloatPopover
        type="tooltip"
        placement="bottom"
        triggerElement={
          <RoundedIconButton
            className="bg-red-200 duration-200 hover:bg-red-400 dark:bg-red-900"
            onClick={() => {
              present({
                title: `删除 ${selectionKeys.size} 条评论`,
                content: ({ dismiss }) => (
                  <div className="w-[400px] text-right">
                    <StyledButton
                      onClick={() => {
                        batchDelete()
                        dismiss()
                      }}
                    >
                      删除
                    </StyledButton>
                  </div>
                ),
              })
            }}
          >
            <i className="i-mingcute-close-line size-5" />
          </RoundedIconButton>
        }
      >
        删除
      </FloatPopover>
    </OffsetHeaderLayout>
  )
}
