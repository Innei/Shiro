import { useSearchParams } from 'next/navigation'

import { CommentState } from '@mx-space/api-client'

import { RoundedIconButton, StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { useModalStack } from '~/components/ui/modal/stacked/provider'
import { toast } from '~/lib/toast'
import {
  useDeleteCommentMutation,
  useUpdateCommentStateMutation,
} from '~/queries/definition/comment'

import {
  useCommentSelectionKeys,
  useSetCommentSelectionKeys,
} from './CommentContext'

export const CommentBatchActionGroup = () => {
  const selectionKeys = useCommentSelectionKeys()
  const setSelectionKeys = useSetCommentSelectionKeys()

  const { mutateAsync: updateCommentState } = useUpdateCommentStateMutation()
  const { mutateAsync: deleteCommentState } = useDeleteCommentMutation()
  // const { mutateAsync: batchChangeState } =
  //   trpc.comment.batchChangeState.useMutation({
  //     onMutate() {
  //       setSelectionKeys(new Set())
  //     },
  //     onSuccess() {
  //       utils.comment.list.invalidate()
  //     },
  //   })
  // const { mutateAsync: batchDelete } = trpc.comment.batchDelete.useMutation({
  //   onMutate() {
  //     setSelectionKeys(new Set())
  //   },
  //   onSuccess() {
  //     utils.comment.list.invalidate()
  //   },
  // })
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
  const tab = parseInt(search.get('tab')!) as any as CommentState

  const { present } = useModalStack()

  if (!tab) return null

  if (!selectionKeys.size) return null
  return (
    <div className="fixed right-4 top-[4rem] z-[2] hidden gap-4 lg:flex">
      {tab !== CommentState.Read && (
        <FloatPopover
          type="tooltip"
          placement="bottom"
          TriggerComponent={() => (
            <RoundedIconButton
              onClick={() => {
                batchChangeState(CommentState.Read)
              }}
            >
              <i className="icon-[mingcute--check-fill] h-5 w-5" />
            </RoundedIconButton>
          )}
        >
          已读
        </FloatPopover>
      )}

      {tab !== CommentState.Junk && (
        <FloatPopover
          type="tooltip"
          placement="bottom"
          TriggerComponent={() => (
            <RoundedIconButton
              className="bg-yellow-400 dark:bg-orange-500"
              onClick={() => {
                batchChangeState(CommentState.Junk)
              }}
            >
              <i className="icon-[mingcute--delete-2-line] h-5 w-5" />
            </RoundedIconButton>
          )}
        >
          垃圾
        </FloatPopover>
      )}
      <FloatPopover
        type="tooltip"
        placement="bottom"
        TriggerComponent={() => (
          <RoundedIconButton
            className="bg-red-200 duration-200 hover:bg-red-400 dark:bg-red-900"
            onClick={() => {
              present({
                title: `删除 ${selectionKeys.size} 条评论`,
                content: ({ dismiss }) => {
                  return (
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
                  )
                },
              })
            }}
          >
            <i className="icon-[mingcute--close-line] h-5 w-5" />
          </RoundedIconButton>
        )}
      >
        删除
      </FloatPopover>
    </div>
  )
}
