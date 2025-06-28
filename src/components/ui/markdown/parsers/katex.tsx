'use client'

import 'katex/dist/katex.min.css'

import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority } from 'markdown-to-jsx'

import { KateX } from '../../katex'
import { blockRegex, simpleInlineRegex } from '../utils/parser'

const INLINE_SKIP_R =
  '((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|\\\\\\1|[\\s\\S])+?)'

//  $ c = \pm\sqrt{a^2 + b^2} $
export const KateXRule: MarkdownToJSX.Rule<{
  katex: string
}> = {
  match: simpleInlineRegex(new RegExp(`^(\\$)(${INLINE_SKIP_R})\\1`)),
  order: Priority.LOW,
  parse(capture) {
    return {
      type: 'kateX',
      katex: capture[2],
    }
  },
  render(node, output, state) {
    return <KateX key={state?.key}>{node.katex}</KateX>
  },
}
export const KateXBlockRule: MarkdownToJSX.Rule<{
  groups: Record<string, string> | undefined
}> = {
  match: blockRegex(
    new RegExp(`^\\s*\\$\\$ *(?<content>[\\s\\S]+?)\\s*\\$\\$ *(?:\n *)+\n?`),
  ),

  order: Priority.MED,
  parse(capture) {
    return {
      type: 'kateXBlock',
      groups: capture.groups,
    }
  },
  render(node, _, state?) {
    if (!node.groups) {
      return null
    }
    return (
      <div className="scrollbar-none overflow-auto" key={state?.key}>
        <KateX mode="display">{node.groups?.content}</KateX>
      </div>
    )
  },
}
