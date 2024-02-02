import { forwardRef, useEffect, useState } from 'react'

import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'

import { BaseCodeHighlighter } from '../code-highlighter'

export const CodeEditor = forwardRef<
  HTMLTextAreaElement,
  {
    content: string
    language: string

    onChange?: (value: string) => void
    minHeight?: string
    className?: string
    padding?: number
  }
>(({ content, language, onChange, minHeight, className, padding = 0 }, ref) => {
  const [highlighterValue, setHighlighterValue] = useState(content)

  useEffect(() => {
    setHighlighterValue(content)
  }, [content])

  const sharedStyles = {
    minHeight,
  }
  return (
    <div
      className={clsxm(
        'relative [&_*]:!font-mono [&_*]:!text-base [&_*]:!leading-[1.5]',
        className,
      )}
      style={
        {
          padding: `${padding}px`,
          '--padding': `${padding * 2}px`,
        } as any
      }
      contentEditable={false}
    >
      <textarea
        onKeyDown={stopPropagation}
        onKeyUp={stopPropagation}
        onPaste={stopPropagation}
        contentEditable={false}
        ref={ref}
        className="absolute size-[calc(100%-var(--padding))] resize-none overflow-hidden bg-transparent p-0 text-transparent caret-accent"
        style={sharedStyles}
        value={highlighterValue}
        onChange={(e) => {
          setHighlighterValue(e.target.value)
          onChange?.(e.target.value)
        }}
      />
      <BaseCodeHighlighter
        className="code-wrap pointer-events-none relative z-[1] !m-0 !p-0"
        style={sharedStyles}
        lang={language}
        content={highlighterValue}
      />
    </div>
  )
})

CodeEditor.displayName = 'CodeEditor'
