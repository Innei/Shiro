'use client'

import { useState } from 'react'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { blockRegex, Priority, simpleInlineRegex } from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import type { FC } from 'react'

import 'katex/dist/katex.min.css'

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

  useIsomorphicLayoutEffect(() => {
    let isMounted = true
    import('katex').then((katex) => {
      if (!isMounted) return
      // biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
      const html = (katex?.default?.renderToString || katex?.renderToString)(
        children,
        {
          displayMode,
          throwOnError,
        },
      )

      setHtml(html)
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className="katex-container"
    />
  )
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
