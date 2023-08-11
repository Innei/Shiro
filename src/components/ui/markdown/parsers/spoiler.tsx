import React from 'react'
import {
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'

// ||Spoiler||
export const SpoilerRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^\|\|((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)\|\|/,
  ),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return (
      <del key={state?.key} className="spoiler" title="你知道的太多了">
        {output(node.content, state!)}
      </del>
    )
  },
}
