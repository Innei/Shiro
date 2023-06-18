'use client'

import Markdown from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import type { FC } from 'react'

const mdOptions: MarkdownToJSX.Options = {
  allowedTypes: [
    'text',
    'paragraph',
    'codeInline',
    'link',
    'linkMailtoDetector',
    'linkBareUrlDetector',
    'linkAngleBraceStyleDetector',
    'textStrikethroughed',
    'textEmphasized',
    'textBolded',
    'textEscaped',
  ],
  forceBlock: true,
  wrapper: ({ children }) => <div className="leading-7">{children}</div>,
}

export const NoteTopicMarkdownRender: FC<{ children: string }> = (props) => {
  return <Markdown options={mdOptions}>{props.children}</Markdown>
}
