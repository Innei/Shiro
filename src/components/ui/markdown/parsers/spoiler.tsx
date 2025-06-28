import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority } from 'markdown-to-jsx'
import * as React from 'react'

import { parseCaptureInline, simpleInlineRegex } from '../utils/parser'

const INLINE_SKIP_R =
  '((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|\\\\\\1|\\|\\|.*?\\|\\||[\\s\\S])+?)'

// ||Spoiler||
export const SpoilerRule: MarkdownToJSX.Rule<{
  children: MarkdownToJSX.ParserResult[]
}> = {
  match: simpleInlineRegex(new RegExp(`^(\\|\\|)${INLINE_SKIP_R}\\1`)),
  order: Priority.LOW,
  parse: parseCaptureInline,
  render(node, output, state?) {
    return (
      <del key={state?.key} className="spoiler" title="你知道的太多了">
        {output(node.children, state!)}
      </del>
    )
  },
}
