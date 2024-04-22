import React, { useState } from 'react'
import { blockRegex, Priority, simpleInlineRegex } from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import type { FC } from 'react'

import { loadScript, loadStyleSheet } from '~/lib/load-script'

// @ts-ignore
const useInsertionEffect = React.useInsertionEffect || React.useEffect
//  $ c = \pm\sqrt{a^2 + b^2} $
export const KateXRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^(?!\\)\$\s{0,}((?:\[(?:[^$]|(?=\\)\$)*?\]|<(?:[^$]|(?=\\)\$)*?>(?:(?:[^$]|(?=\\)\$)*?<(?:[^$]|(?=\\)\$)*?>)?|`(?:[^$]|(?=\\)\$)*?`|(?:[^$]|(?=\\)\$))*?)\s{0,}(?!\\)\$/,
  ),
  order: Priority.MED,
  parse(capture) {
    return {
      type: 'kateX',
      katex: capture[1],
    }
  },
  react(node, output, state) {
    return <LateX key={state?.key}>{node.katex}</LateX>
  },
}

type LateXProps = {
  children: string
  mode?: string // If `display` the math will be rendered in display mode. Otherwise the math will be rendered in inline mode.
}

const LateX: FC<LateXProps> = (props) => {
  const { children, mode } = props

  const [html, setHtml] = useState('')

  const displayMode = mode === 'display'

  const throwOnError = false // render unsupported commands as text instead of throwing a `ParseError`

  useInsertionEffect(() => {
    loadStyleSheet(
      'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
    )
    loadScript(
      'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
    ).then(() => {
      // @ts-ignore
      const html = window.katex.renderToString(children, {
        displayMode,
        throwOnError,
      })
      setHtml(html)
    })
  }, [])

  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export const KateXBlockRule: MarkdownToJSX.Rule = {
  match: blockRegex(
    new RegExp(`^\\s*\\$\\$ *(?<content>[\\s\\S]+?)\\s*\\$\\$ *(?:\n *)+\n?`),
  ),

  order: Priority.LOW,
  parse(capture) {
    return {
      type: 'kateXBlock',
      groups: capture.groups,
    }
  },
  react(node, _, state?) {
    return (
      <div className="scrollbar-none overflow-auto" key={state?.key}>
        <LateX mode="display">{node.groups.content}</LateX>
      </div>
    )
  },
}
