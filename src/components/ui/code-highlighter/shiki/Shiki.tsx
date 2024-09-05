import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import type { FC } from 'react'
import { use, useMemo, useState } from 'react'
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki'
import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'

import { isServerSide } from '~/lib/env'

import { codeHighlighter as shiki } from './core'
import { ShikiHighLighterWrapper } from './ShikiWrapper'
import { parseShouldCollapsedFromAttrs } from './utils'

export interface ShikiProps {
  lang: string | undefined
  content: string
  attrs?: string
}

const codeHighlighter = (() => {
  if (isServerSide) return

  const js = createJavaScriptRegexEngine()
  const core = createHighlighterCoreSync({
    themes: [githubDark, githubLight],
    langs: [],
    engine: js,
  })

  return {
    codeHighlighter: core,
    fn: (o: { lang: string; attrs: string; code: string }) => shiki(core, o),
  }
})()

export const ShikiHighLighter: FC<ShikiProps> = (props) => {
  const { lang: language, content: value, attrs } = props

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
    }, [language]),
  )
  const highlightedHtml = useMemo(
    () =>
      codeHighlighter?.fn?.({
        attrs: attrs || '',
        // code: `${value.split('\n')[0].repeat(10)} // [!code highlight]\n${value}`,
        code: value,
        lang: language ? language.toLowerCase() : '',
      }),
    [attrs, language, value],
  )

  // const [renderedHtml, setRenderedHtml] = useState(highlightedHtml)
  const [codeBlockRef, setCodeBlockRef] = useState<HTMLDivElement | null>(null)
  useIsomorphicLayoutEffect(() => {
    if (!highlightedHtml) return
    if (!codeBlockRef) return

    const $lines = codeBlockRef.querySelectorAll('.line')
    const maxLineWidth = Math.max(
      ...Array.from($lines).map((el) => (el as HTMLElement).scrollWidth),
    )
    $lines.forEach((el) => {
      ;(el as HTMLElement).style.width = `${maxLineWidth}px`
    })

    // const pre = codeBlockRef.querySelector('pre')
    // if (pre) setRenderedHtml(pre.outerHTML)
  }, [codeBlockRef, highlightedHtml])

  return (
    <ShikiHighLighterWrapper
      shouldCollapsed={parseShouldCollapsedFromAttrs(attrs || '')}
      {...props}
      renderedHTML={highlightedHtml}
      ref={setCodeBlockRef}
    />
  )
}
