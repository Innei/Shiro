import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority } from 'markdown-to-jsx'

import { Spoiler } from '../renderers/spoiler'
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
    return <Spoiler key={state?.key}>{output(node.children, state!)}</Spoiler>
  },
}
