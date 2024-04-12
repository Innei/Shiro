import { useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'

import { isServerSide } from '~/lib/env'

import { ShikiHighLighterWrapper } from './ShikiWrapper'

interface Props {
  lang: string | undefined
  content: string

  attrs?: string
}

const codeHighlighter = await (async () => {
  if (isServerSide) return
  const [{ getHighlighterCore }, getWasm, { codeHighlighter }] =
    await Promise.all([
      import('shiki'),
      import('shiki/wasm').then((m) => m.default),
      import('./core'),
    ])

  const loaded = await getHighlighterCore({
    themes: [
      import('shiki/themes/github-light.mjs'),
      import('shiki/themes/github-dark.mjs'),
    ],
    langs: [
      () => import('shiki/langs/javascript.mjs'),
      () => import('shiki/langs/typescript.mjs'),
      () => import('shiki/langs/css.mjs'),
      () => import('shiki/langs/tsx.mjs'),
      () => import('shiki/langs/jsx.mjs'),
      () => import('shiki/langs/json.mjs'),
      () => import('shiki/langs/sql.mjs'),
      () => import('shiki/langs/rust.mjs'),
      () => import('shiki/langs/go.mjs'),
      () => import('shiki/langs/cpp.mjs'),
      () => import('shiki/langs/c.mjs'),
      () => import('shiki/langs/markdown.mjs'),
      () => import('shiki/langs/vue.mjs'),
      () => import('shiki/langs/html.mjs'),
      () => import('shiki/langs/asm.mjs'),
      () => import('shiki/langs/shell.mjs'),
      () => import('shiki/langs/ps.mjs'),
    ],
    loadWasm: getWasm,
  })

  return (o: { lang: string; attrs: string; code: string }) =>
    codeHighlighter(loaded, o)
})()

export const ShikiHighLighter: FC<Props> = (props) => {
  const { lang: language, content: value, attrs } = props

  const highlightedHtml = useMemo(() => {
    return codeHighlighter?.({
      attrs: attrs || '',
      // code: `${value.split('\n')[0].repeat(10)} // [!code highlight]\n${value}`,
      code: value,
      lang: language ? language.toLowerCase() : '',
    })
  }, [attrs, language, value])

  const [renderedHtml, setRenderedHtml] = useState(highlightedHtml)
  const [codeBlockRef, setCodeBlockRef] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    setRenderedHtml(highlightedHtml)
    requestAnimationFrame(() => {
      if (!highlightedHtml) return
      if (!codeBlockRef) return

      const $lines = codeBlockRef.querySelectorAll('.line')
      const maxLineWidth = Math.max(
        ...Array.from($lines).map((el) => {
          return (el as HTMLElement).scrollWidth
        }),
      )
      $lines.forEach((el) => {
        ;(el as HTMLElement).style.width = `${maxLineWidth}px`
      })

      const pre = codeBlockRef.querySelector('pre')
      if (pre) setRenderedHtml(pre.outerHTML)
    })
  }, [codeBlockRef, highlightedHtml])

  return (
    <ShikiHighLighterWrapper
      {...props}
      renderedHTML={renderedHtml}
      ref={setCodeBlockRef}
    />
  )
}
