import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import React from 'react'

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
