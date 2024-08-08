import React from 'react'
import {
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'

//  ++Insert++
export const InsertRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^\+\+((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)\+\+/,
  ),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return <ins key={state?.key}>{output(node.content, state!)}</ins>
  },
}
