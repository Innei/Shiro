'use client'

import type { LexicalEditor } from 'lexical'
import { $getSelection, $isRangeSelection } from 'lexical'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useRef } from 'react'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { FloatPopover } from '~/components/ui/float-popover'
import { MarkdownEditor } from '~/components/ui/markdown-editor'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { clsxm } from '~/lib/helper'

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

  const editorRef = useRef<LexicalEditor | null>(null)
  const shouldAutoFocusByHash =
    typeof location !== 'undefined' && location.hash === '#comment'
  const shouldAutoFocus = !!autoFocus || shouldAutoFocusByHash

  const handleInsertText = useCallback((text: string) => {
    const editor = editorRef.current
    if (!editor) return
    editor.focus()
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        selection.insertText(` ${text} `)
      }
    })
  }, [])

  const contentClassName = useMemo(
    () => clsxm(className, 'overflow-auto flex-1 h-0! min-h-0!'),
    [className],
  )

  return (
    <MarkdownEditor
      autoFocus={shouldAutoFocus}
      className="relative flex flex-col overflow-hidden pb-8"
      contentClassName={contentClassName}
      placeholder={placeholder}
      scrollIntoView={shouldAutoFocusByHash}
      value={value}
      actions={
        <CommentBoxSlotPortal>
          {!isMobile && (
            <FloatPopover
              headless
              mobileAsSheet
              popoverClassNames="pointer-events-auto"
              popoverWrapperClassNames="z-[999]"
              trigger="click"
              triggerElement={
                <div
                  className={'center inline-flex size-5 text-base'}
                  role="button"
                  tabIndex={0}
                >
                  <i className="i-mingcute-emoji-2-line" />
                  <span className="sr-only">{t('emoji_label')}</span>
                </div>
              }
            >
              <EmojiPicker onEmojiSelect={handleInsertText} />
            </FloatPopover>
          )}
        </CommentBoxSlotPortal>
      }
      onChange={(next) => setter('text', next)}
      onSubmit={sendComment}
      onEditorReady={(editor) => {
        editorRef.current = editor
      }}
    />
  )
}
