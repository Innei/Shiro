import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { atom, useStore } from 'jotai'
import markdownEscape from 'markdown-escape'
import type { CommentModel } from '@mx-space/api-client'

import { useIsMobile } from '~/atoms/hooks'
import { MotionButtonBase, StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { TextArea } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useCurrentModal } from '~/components/ui/modal'
import { ScrollArea } from '~/components/ui/scroll-area'
import { PresentSheet } from '~/components/ui/sheet'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'
import { toast } from '~/lib/toast'
import { useReplyCommentMutation } from '~/queries/hooks/comment'

import { KAOMOJI_LIST } from './kaomoji'

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

  const KaomojiContentEl = (
    <ScrollArea.Root className="pointer-events-auto h-[250px] w-auto overflow-scroll lg:h-[200px] lg:w-[400px]">
      <ScrollArea.Viewport
        onWheel={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="grid grid-cols-4 gap-4">
          {KAOMOJI_LIST.map((kamoji) => {
            return (
              <MotionButtonBase
                key={kamoji}
                onClick={() => {
                  const $ta = ref.current!
                  $ta.focus()

                  requestAnimationFrame(() => {
                    const start = $ta.selectionStart as number
                    const end = $ta.selectionEnd as number
                    const escapeKaomoji = markdownEscape(kamoji)
                    $ta.value = `${$ta.value.substring(
                      0,
                      start,
                    )} ${escapeKaomoji} ${$ta.value.substring(
                      end,
                      $ta.value.length,
                    )}`

                    requestAnimationFrame(() => {
                      const shouldMoveToPos = start + escapeKaomoji.length + 2
                      $ta.selectionStart = shouldMoveToPos
                      $ta.selectionEnd = shouldMoveToPos

                      $ta.focus()
                    })
                  })
                }}
              >
                {kamoji}
              </MotionButtonBase>
            )
          })}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  )

  const [kaomojiPanelOpen, setKaomojiPanelOpen] = useState(false)
  const KaomojiButton = (
    <MotionButtonBase>
      <i className="icon-[mingcute--emoji-line]" />
    </MotionButtonBase>
  )
  const isMobile = useIsMobile()

  useEffect(() => {
    const $ = ref.current
    return () => {
      if (!$) return
      store.set(replyTextAtom, $.value)
    }
  }, [store, ref])

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

      <div className="mt-4 flex justify-between gap-2">
        {isMobile ? (
          <PresentSheet
            onOpenChange={setKaomojiPanelOpen}
            content={KaomojiContentEl}
            zIndex={1002}
          >
            {KaomojiButton}
          </PresentSheet>
        ) : (
          <FloatPopover
            onClose={() => {
              setKaomojiPanelOpen(false)
            }}
            onOpen={() => {
              setKaomojiPanelOpen(true)
            }}
            placement="left-end"
            trigger="click"
            to={modalElRef.current!}
            triggerElement={KaomojiButton}
          >
            {KaomojiContentEl}
          </FloatPopover>
        )}

        <StyledButton onClick={handleReply} type="submit">
          回复
        </StyledButton>
      </div>
    </form>
  )
}
