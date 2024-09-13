'use client'

import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { FloatPopover } from '~/components/ui/float-popover'
import { TextArea } from '~/components/ui/input'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { scrollTextareaToCursor } from '~/lib/dom'

import { getRandomPlaceholder } from './constants'
import {
  useCommentBoxTextValue,
  useSendComment,
  useSetCommentBoxValues,
} from './hooks'
import { CommentBoxSlotPortal } from './providers'

const EmojiPicker = dynamic(() =>
  import('../../shared/EmojiPicker').then((mod) => mod.EmojiPicker),
)
export const UniversalTextArea: Component = ({ className }) => {
  const placeholder = useRefValue(() => getRandomPlaceholder())
  const setter = useSetCommentBoxValues()
  const value = useCommentBoxTextValue()

  const taRef = useRef<HTMLTextAreaElement>(null)
  const handleInsertEmoji = useCallback(
    (emoji: string) => {
      if (!taRef.current) {
        return
      }

      const $ta = taRef.current
      const start = $ta.selectionStart
      const end = $ta.selectionEnd

      $ta.value = `${$ta.value.slice(
        0,
        Math.max(0, start),
      )} ${emoji} ${$ta.value.substring(end, $ta.value.length)}`

      setter('text', $ta.value)
      requestAnimationFrame(() => {
        const shouldMoveToPos = start + emoji.length + 2
        $ta.selectionStart = shouldMoveToPos
        $ta.selectionEnd = shouldMoveToPos

        $ta.focus()
      })
    },
    [setter],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault()
        const $ta = taRef.current
        if ($ta) {
          const start = $ta.selectionStart
          const end = $ta.selectionEnd
          const textBefore = $ta.value.slice(0, Math.max(0, start))
          const textAfter = $ta.value.slice(Math.max(0, end))
          $ta.value = `${textBefore}\n\n${textAfter}`
          setter('text', $ta.value)

          requestAnimationFrame(() => {
            const shouldMoveToPos = start + 2
            $ta.selectionStart = shouldMoveToPos
            $ta.selectionEnd = shouldMoveToPos
            $ta.focus()
            // 上面设置的光标，可能不在可见区域内，因此 scroll 到光标所在位置
            scrollTextareaToCursor(taRef)
          })
        }
      }
    },
    [setter],
  )

  useEffect(() => {
    const $ta = taRef.current
    if (!$ta) return
    if (value !== $ta.value) {
      $ta.value = value
    }
  }, [value])

  useIsomorphicLayoutEffect(() => {
    if (location.hash !== '#comment') {
      return
    }

    // autofocus
    const $ta = taRef.current
    if (!$ta) return
    $ta.selectionStart = $ta.selectionEnd = $ta.value.length
    $ta.focus()

    $ta.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const [sendComment] = useSendComment()
  const isMobile = useIsMobile()
  return (
    <TextArea
      bordered={false}
      wrapperClassName={className}
      ref={taRef}
      defaultValue={value}
      onKeyDown={handleKeyDown}
      onChange={(e) => setter('text', e.target.value)}
      placeholder={placeholder}
      onCmdEnter={(e) => {
        e.preventDefault()
        sendComment()
      }}
    >
      <CommentBoxSlotPortal>
        {!isMobile && (
          <FloatPopover
            mobileAsSheet
            trigger="click"
            triggerElement={
              <div
                className="center ml-0 inline-flex size-5 translate-y-1 text-base md:ml-4"
                role="button"
                tabIndex={0}
              >
                <i className="icon-[mingcute--emoji-2-line]" />
                <span className="sr-only">表情</span>
              </div>
            }
            headless
            popoverWrapperClassNames="z-[999]"
            popoverClassNames="pointer-events-auto"
          >
            <EmojiPicker onEmojiSelect={handleInsertEmoji} />
          </FloatPopover>
        )}
      </CommentBoxSlotPortal>
    </TextArea>
  )
}
