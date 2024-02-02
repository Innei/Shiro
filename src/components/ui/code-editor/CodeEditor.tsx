import { useEffect, useState } from 'react'
import type { FC } from 'react'

import { BaseCodeHighlighter } from '../code-highlighter'

export const CodeEditor: FC<{
  content: string
  language: string

  onChange?: (value: string) => void
}> = ({ content, language, onChange }) => {
  const [highlighterValue, setHighlighterValue] = useState(content)

  useEffect(() => {
    setHighlighterValue(content)
  }, [content])

  return (
    <div className="relative">
      <textarea
        className="absolute h-full w-full resize-none overflow-hidden bg-transparent p-0 !font-mono text-transparent caret-accent *:leading-4"
        value={highlighterValue}
        onChange={(e) => {
          setHighlighterValue(e.target.value)
          onChange?.(e.target.value)
        }}
      />
      <BaseCodeHighlighter
        className="code-wrap pointer-events-none relative z-[1] !m-0 !p-0 *:!font-mono *:!leading-4"
        lang={language}
        content={highlighterValue}
      />
    </div>
  )
}
