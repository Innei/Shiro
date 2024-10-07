import type { CommentModel } from '@mx-space/api-client'
import clsx from 'clsx'
import { atom, useStore } from 'jotai'
import { useEffect, useState } from 'react'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { StyledButton } from '~/components/ui/button'
import { TextArea } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useCurrentModal } from '~/components/ui/modal'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'
import { toast } from '~/lib/toast'
import { useReplyCommentMutation } from '~/queries/hooks/comment'

const replyTextAtom = atom('')
export const ReplyModal = (props: { comment: CommentModel }) => {
  const { author, id, text } = props.comment

  const store = useStore()
  const [, getValue, ref] = useUncontrolledInput<HTMLTextAreaElement>(
    store.get(replyTextAtom),
  )

  const { dismiss, ref: modalElRef } = useCurrentModal()

  const { mutateAsync: reply } = useReplyCommentMutation()
  const handleReply = useEventCallback(async () => {
    const text = getValue()
    if (!text) {
      toast.error('回复内容不能为空')
      return
    }

    reply({
      id,
      content: text,
    })

    dismiss()

    store.set(replyTextAtom, '')
  })

  const handleSubmit = useEventCallback((e: any) => {
    e.preventDefault()
  })

  const handleKeyDown = useEventCallback((e: React.KeyboardEvent) => {
    // cmd + enter / ctrl + enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleReply()
    }
  })

  const isMobile = useIsMobile()

  useEffect(() => {
    const $ = ref.current
    return () => {
      if (!$) return
      store.set(replyTextAtom, $.value)
    }
  }, [store, ref])

  const [kaomojiPanelOpen, setKaomojiPanelOpen] = useState(false)

  return (
    <form
      className="flex w-[500px] max-w-full flex-col"
      onSubmit={handleSubmit}
    >
      <div className="mb-8">
        <Label>回复 {author}：</Label>
        <div className="relative mt-4 h-[100px]">
          <TextArea
            bordered={false}
            className="cursor-not-allowed bg-gray-100 dark:bg-neutral-900"
            rounded="md"
            readOnly
            value={text}
            onCmdEnter={(e) => {
              e.preventDefault()
              handleReply()
            }}
          />
        </div>
      </div>

      <Label htmlFor="reply">回复内容：</Label>
      <div className="relative mt-4 h-[200px]">
        <TextArea
          autoFocus
          onKeyDown={handleKeyDown}
          className="rounded-md border"
          id="reply"
          ref={ref}
        />
      </div>

      {isMobile && (
        <div
          className={clsx(
            kaomojiPanelOpen ? 'pb-[300px]' : 'pb-0',
            'duration-200',
          )}
        />
      )}

      <div className="mt-4 flex justify-end gap-2">
        <StyledButton onClick={handleReply} type="submit">
          回复
        </StyledButton>
      </div>
    </form>
  )
}
