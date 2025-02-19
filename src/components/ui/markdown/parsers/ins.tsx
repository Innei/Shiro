import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import * as React from 'react'

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
