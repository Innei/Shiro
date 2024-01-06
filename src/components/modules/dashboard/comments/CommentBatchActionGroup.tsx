import { useSearchParams } from 'next/navigation'

import { CommentState } from '@mx-space/api-client'

import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { useModalStack } from '~/components/ui/modal/stacked/provider'

import {
  useCommentSelectionKeys,
  useSetCommentSelectionKeys,
} from './CommentContext'

export const CommentBatchActionGroup = () => {
  const selectionKeys = useCommentSelectionKeys()
  const setSelectionKeys = useSetCommentSelectionKeys()

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
  const search = useSearchParams()
  const tab = search.get('tab') as any as CommentState

  const { present } = useModalStack()

  if (!tab) return null

  if (!selectionKeys.size) return null
  return (
    <div className="absolute right-0 top-0 hidden gap-4 lg:flex">
      {tab !== CommentState.Read && (
        <FloatPopover
          type="tooltip"
          placement="bottom"
          TriggerComponent={() => (
            <MotionButtonBase
              onClick={() => {
                // batchChangeState({
                //   ids: Array.from(selectionKeys),
                //   state: CommentState.READ,
                // })
              }}
            >
              <i className="icon-[mingcute--check-fill]" />
            </MotionButtonBase>
          )}
        >
          已读
        </FloatPopover>
      )}

      <FloatPopover
        type="tooltip"
        placement="bottom"
        TriggerComponent={() => (
          <MotionButtonBase
            onClick={() => {
              // batchChangeState({
              //   ids: Array.from(selectionKeys),
              //   state: CommentState.SPAM,
              // })
            }}
          >
            <i className="icon-[mingcute--delete-2-line]" />
          </MotionButtonBase>
        )}
      >
        垃圾
      </FloatPopover>

      <FloatPopover
        type="tooltip"
        placement="bottom"
        TriggerComponent={() => (
          <MotionButtonBase
            onClick={() => {
              present({
                title: `删除 ${selectionKeys.size} 条评论`,
                content: ({ dismiss }) => {
                  return (
                    <div className="w-[400px] text-right">
                      <MotionButtonBase
                        color="destructive"
                        onClick={() => {
                          // batchDelete({
                          //   ids: Array.from(selectionKeys),
                          // })
                          dismiss()
                        }}
                      >
                        删除
                      </MotionButtonBase>
                    </div>
                  )
                },
              })
            }}
          >
            <i className="icon-[mingcute--close-line]" />
          </MotionButtonBase>
        )}
      >
        删除
      </FloatPopover>
    </div>
  )
}
