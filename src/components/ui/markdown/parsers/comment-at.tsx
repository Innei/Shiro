import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import React, { Fragment } from 'react'

// @
export const CommentAtRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(/^@(\w+)\s/),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, _, state) {
    const { content } = node

    if (!content || !content[0]?.content) {
      return <Fragment key={state?.key} />
    }

    return <span key={state?.key}>@{content[0]?.content}</span>
  },
}
