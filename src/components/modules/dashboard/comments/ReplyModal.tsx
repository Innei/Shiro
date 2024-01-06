import markdownEscape from 'markdown-escape'
import type { CommentModel } from '@mx-space/api-client'

import { useIsMobile } from '~/atoms'
import { MotionButtonBase } from '~/components/ui/button'
import { useCurrentModal } from '~/components/ui/modal'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'
import { $axios } from '~/lib/request'
import { toast } from '~/lib/toast'

import { KAOMOJI_LIST } from './kaomoji'

export const ReplyModal = (props: CommentModel) => {
  const { author, id, text } = props

  const [, getValue, ref] = useUncontrolledInput<HTMLTextAreaElement>()
  const handleSubmit = useEventCallback((e: any) => {
    e.preventDefault()
  })

  const { dismiss, ref: modalElRef } = useCurrentModal()

  const handleReply = useEventCallback(async () => {
    const text = getValue()
    if (!text) {
      toast.error('回复内容不能为空')
      return
    }

    await $axios.post(`/comments/master/reply/${id}`, {
      text,
    })

    toast.success('回复成功')
    // utils.comment.list.refetch()
    dismiss()
  })
  const KaomojiContentEl = (
    <ScrollArea.Root className="pointer-events-auto h-[50vh] w-auto overflow-scroll lg:h-[200px] lg:w-[400px]">
      <ScrollArea.Viewport>
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
  const KaomojiButton = (
    <MotionButtonBase>
      <i className="icon-[mingcute--emoji-line]" />
    </MotionButtonBase>
  )
  const isMobile = useIsMobile()
  return (
    <form
      className="flex w-[500px] max-w-full flex-col"
      onSubmit={handleSubmit}
    >
      {/* <TextArea
        label={`${author} 说：`}
        className="[&_*]:!cursor-not-allowed"
        readOnly
        value={text}
      />

      <TextArea label="回复内容：" className="mt-4" ref={ref} />

      <div className="mt-4 flex justify-between gap-2">
        {isMobile ? (
          <PresentDrawer content={KaomojiContentEl} zIndex={1002}>
            {KaomojiButton}
          </PresentDrawer>
        ) : (
          <FloatPopover
            trigger="click"
            to={modalElRef.current!}
            TriggerComponent={() => KaomojiButton}
          >
            {KaomojiContentEl}
          </FloatPopover>
        )}

        <Button color="primary" size="sm" onClick={handleReply} type="submit">
          {t('common.submit')}
        </Button> 
      </div> */}
    </form>
  )
}
