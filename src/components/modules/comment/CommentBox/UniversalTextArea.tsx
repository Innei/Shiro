'use client'

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

import { FloatPopover } from '~/components/ui/float-popover'
import { TextArea } from '~/components/ui/input'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { preventDefault } from '~/lib/dom'

import { getRandomPlaceholder } from './constants'
import { useCommentBoxTextValue, useSetCommentBoxValues } from './hooks'
import { CommentBoxSlotPortal } from './providers'

const EmojiPicker = dynamic(() =>
  import('../../shared/EmojiPicker').then((mod) => mod.EmojiPicker),
)
export const UniversalTextArea = () => {
  const placeholder = useRefValue(() => getRandomPlaceholder())
  const setter = useSetCommentBoxValues()
  const value = useCommentBoxTextValue()

  const taRef = useRef<HTMLTextAreaElement>(null)
  const handleInsertEmoji = useCallback((emoji: string) => {
    if (!taRef.current) {
      return
    }

    const $ta = taRef.current
    const start = $ta.selectionStart
    const end = $ta.selectionEnd

    $ta.value = `${$ta.value.substring(
      0,
      start,
    )} ${emoji} ${$ta.value.substring(end, $ta.value.length)}`

    setter('text', $ta.value)
    requestAnimationFrame(() => {
      const shouldMoveToPos = start + emoji.length + 2
      $ta.selectionStart = shouldMoveToPos
      $ta.selectionEnd = shouldMoveToPos

      $ta.focus()
    })
  }, [])

  useEffect(() => {
    const $ta = taRef.current
    if (!$ta) return
    if (value !== $ta.value) {
      $ta.value = value
    }
  }, [value])

  useLayoutEffect(() => {
    // autofocus
    const $ta = taRef.current
    if (!$ta) return
    $ta.selectionStart = $ta.selectionEnd = $ta.value.length
    $ta.focus()
  }, [])

  return (
    <TextArea
      ref={taRef}
      defaultValue={value}
      onChange={(e) => setter('text', e.target.value)}
      placeholder={placeholder}
    >
      <CommentBoxSlotPortal>
        <FloatPopover trigger="click" TriggerComponent={EmojiButton} headless>
          <EmojiPicker onEmojiSelect={handleInsertEmoji} />
        </FloatPopover>
      </CommentBoxSlotPortal>
    </TextArea>
  )
}

const EmojiButton = () => {
  return (
    <button
      className="ml-0 inline-flex h-5 w-5 translate-y-1 text-base center md:ml-4"
      onClick={preventDefault}
    >
      <i className="icon-[mingcute--emoji-2-line]" />
      <span className="sr-only">表情</span>
    </button>
  )
}
