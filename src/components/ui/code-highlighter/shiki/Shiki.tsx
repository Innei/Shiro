import { use, useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'

import { isServerSide } from '~/lib/env'

import { ShikiHighLighterWrapper } from './ShikiWrapper'
import { parseShouldCollapsedFromAttrs } from './utils'

export interface ShikiProps {
  lang: string | undefined
  content: string

  attrs?: string
}

const codeHighlighterPromise = (async () => {
  if (isServerSide) return
  const [{ getHighlighterCore }, getWasm, { codeHighlighter }] =
    await Promise.all([
      import('shiki/core'),
      import('shiki/wasm').then((m) => m.default),
      import('./core'),
    ])

  const core = await getHighlighterCore({
    themes: [
      import('shiki/themes/github-light.mjs'),
      import('shiki/themes/github-dark.mjs'),
    ],
    langs: [],
    loadWasm: getWasm,
  })

  return {
    codeHighlighter: core,
    fn: (o: { lang: string; attrs: string; code: string }) => {
      return codeHighlighter(core, o)
    },
  }
})()

export const ShikiHighLighter: FC<ShikiProps> = (props) => {
  const { lang: language, content: value, attrs } = props
  const codeHighlighter = use(codeHighlighterPromise)

  use(
    useMemo(async () => {
      async function loadShikiLanguage(language: string, languageModule: any) {
        const shiki = codeHighlighter?.codeHighlighter
        if (!shiki) return
        if (!shiki.getLoadedLanguages().includes(language)) {
          await shiki.loadLanguage(await languageModule())
        }
      }

      const { bundledLanguages } = await import('shiki/langs')

      if (!language) return
      const importFn = (bundledLanguages as any)[language]
      if (!importFn) return
      return loadShikiLanguage(language || '', importFn)
    }, [codeHighlighter?.codeHighlighter, language]),
  )
  const highlightedHtml = useMemo(() => {
    return codeHighlighter?.fn?.({
      attrs: attrs || '',
      // code: `${value.split('\n')[0].repeat(10)} // [!code highlight]\n${value}`,
      code: value,
      lang: language ? language.toLowerCase() : '',
    })
  }, [attrs, codeHighlighter, language, value])

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
      shouldCollapsed={parseShouldCollapsedFromAttrs(attrs || '')}
      {...props}
      renderedHTML={renderedHtml}
      ref={setCodeBlockRef}
    />
  )
}
