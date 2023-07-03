'use client'

import { useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { m, useMotionTemplate, useMotionValue } from 'framer-motion'
import dynamic from 'next/dynamic'

import { useIsMobile } from '~/atoms'
import { FloatPopover } from '~/components/ui/float-popover'
import { preventDefault } from '~/lib/dom'

import { getRandomPlaceholder } from './constants'
import { useCommentBoxTextValue, useSetCommentBoxValues } from './hooks'
import { CommentBoxSlotPortal } from './providers'

const EmojiPicker = dynamic(() =>
  import('../../shared/EmojiPicker').then((mod) => mod.EmojiPicker),
)
export const UniversalTextArea = () => {
  const placeholder = useRef(getRandomPlaceholder()).current
  const setter = useSetCommentBoxValues()
  const value = useCommentBoxTextValue()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
    },
    [mouseX, mouseY],
  )
  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 85%)`
  const isMobile = useIsMobile()
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
  return (
    <div
      className="group relative h-full [--spotlight-color:hsl(var(--a)_/_0.05)]"
      onMouseMove={handleMouseMove}
    >
      {!isMobile && (
        <m.div
          className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-[150px] rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
          aria-hidden="true"
        />
      )}
      <textarea
        ref={taRef}
        defaultValue={value}
        onChange={(e) => setter('text', e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'h-full w-full resize-none bg-transparent',
          'overflow-auto px-3 py-4',
          'text-neutral-900/80 dark:text-slate-100/80',
        )}
      />

      <CommentBoxSlotPortal>
        <FloatPopover trigger="click" TriggerComponent={EmojiButton}>
          <EmojiPicker onEmojiSelect={handleInsertEmoji} />
        </FloatPopover>
      </CommentBoxSlotPortal>
    </div>
  )
}

const EmojiButton = () => {
  return (
    <button
      className="ml-4 inline-flex h-5 w-5 translate-y-1 text-base center"
      onClick={preventDefault}
    >
      <i className="icon-[mingcute--emoji-2-line]" />
      <span className="sr-only">表情</span>
    </button>
  )
}
