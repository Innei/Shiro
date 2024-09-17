'use client'

import 'katex/dist/katex.min.css'

import type { MarkdownToJSX } from 'markdown-to-jsx'
import { blockRegex, Priority, simpleInlineRegex } from 'markdown-to-jsx'

import { KateX } from '../../katex'

//  $ c = \pm\sqrt{a^2 + b^2} $
export const KateXRule: MarkdownToJSX.Rule = {
  match: (source) => {
    return simpleInlineRegex(
      /^(?!\\)\$\s*((?:\[(?:[^$]|(?=\\)\$)*?\]|<(?:[^$]|(?=\\)\$)*?>(?:(?:[^$]|(?=\\)\$)*?<(?:[^$]|(?=\\)\$)*?>)?|`(?:[^$]|(?=\\)\$)*?`|[^$]|(?=\\)\$)*?)\s*(?!\\)\$/,
    )(source, { inline: true })
  },
  order: Priority.LOW,
  parse(capture) {
    return {
      type: 'kateX',
      katex: capture[1],
    }
  },
  react(node, output, state) {
    return <KateX key={state?.key}>{node.katex}</KateX>
  },
}
export const KateXBlockRule: MarkdownToJSX.Rule = {
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
  react(node, _, state?) {
    return (
      <div className="scrollbar-none overflow-auto" key={state?.key}>
        <KateX mode="display">{node.groups.content}</KateX>
      </div>
    )
  },
}
