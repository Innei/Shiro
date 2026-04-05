'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { FloatPopover } from '~/components/ui/float-popover'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { clsxm } from '~/lib/helper'
import { sample } from '~/lib/lodash'

import { KAOMOJI_LIST } from '../../shared/kaomoji'
import { KaomojiPanel } from '../../shared/KaomojiPanel'
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

export const UniversalTextArea: Component<{ autoFocus?: boolean }> = ({
  className,
  autoFocus,
}) => {
  const t = useTranslations('common')
  const placeholder = useRefValue(() => getRandomPlaceholder(t.raw))
  const setter = useSetCommentBoxValues()
  const value = useCommentBoxTextValue()
  const [sendComment] = useSendComment()
  const isMobile = useIsMobile()

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const shouldAutoFocusByHash =
    typeof location !== 'undefined' && location.hash === '#comment'
  const shouldAutoFocus = !!autoFocus || shouldAutoFocusByHash

  useEffect(() => {
    if (shouldAutoFocus) {
      textareaRef.current?.focus()
    }
    if (shouldAutoFocusByHash) {
      textareaRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldAutoFocus, shouldAutoFocusByHash])

  const handleInsertText = useCallback((text: string) => {
    const $ta = textareaRef.current
    if (!$ta) return
    $ta.focus()
    const start = $ta.selectionStart
    const end = $ta.selectionEnd
    const before = $ta.value.slice(0, start)
    const after = $ta.value.slice(end)
    const inserted = ` ${text} `
    const newValue = before + inserted + after
    setter('text', newValue)

    requestAnimationFrame(() => {
      const pos = start + inserted.length
      $ta.selectionStart = pos
      $ta.selectionEnd = pos
      $ta.focus()
    })
  }, [setter])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        sendComment()
      }
    },
    [sendComment],
  )

  return (
    <div className="relative flex flex-col overflow-hidden pb-8">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setter('text', e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={clsxm(
          'overflow-auto flex-1 h-0! min-h-0! w-full resize-none bg-transparent p-2 text-sm outline-none',
          className,
        )}
      />
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
                <i className="i-mingcute-emoji-2-line" />
                <span className="sr-only">{t('emoji_label')}</span>
              </div>
            }
            headless
            popoverWrapperClassNames="z-[999]"
            popoverClassNames="pointer-events-auto"
          >
            <EmojiPicker onEmojiSelect={handleInsertText} />
          </FloatPopover>
        )}
        <KaomojiPanel placement="bottom" onInsert={handleInsertText}>
          <div
            role="button"
            tabIndex={0}
            className="center ml-0 inline-flex shrink-0 text-xs md:ml-4"
          >
            {useMemo(() => sample(KAOMOJI_LIST), [])}
            <span className="sr-only">{t('kaomoji_label')}</span>
          </div>
        </KaomojiPanel>
      </CommentBoxSlotPortal>
    </div>
  )
}
