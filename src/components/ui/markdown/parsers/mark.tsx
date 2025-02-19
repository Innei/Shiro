import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import * as React from 'react'

//  ==Mark==
export const MarkRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(/^==((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)==/),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return (
      <mark key={state?.key} className="rounded-md">
        <span className="px-1">{output(node.content, state!)}</span>
      </mark>
    )
  },
}
