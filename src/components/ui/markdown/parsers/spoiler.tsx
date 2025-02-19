import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import * as React from 'react'

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
