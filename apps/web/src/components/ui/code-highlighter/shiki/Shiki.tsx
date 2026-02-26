import './Shiki.css'

import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import type { FC } from 'react'
import { use, useMemo, useState } from 'react'
import type { BundledLanguage, LanguageInput, SpecialLanguage } from 'shiki'
import { createHighlighterCore, createOnigurumaEngine } from 'shiki'
import { bundledLanguages } from 'shiki/langs'
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

const codeHighlighterPromise = (() => {
  if (isServerSide) return Promise.resolve(null)

  return createHighlighterCore({
    themes: [githubDark, githubLight],
    langs: [],
    engine: createOnigurumaEngine(() => import('shiki/wasm')),
  })
})()

interface ShikiHighLighterImplProps extends ShikiProps {
  highlighter: NonNullable<Awaited<typeof codeHighlighterPromise>>
}

const ShikiHighLighterImpl: FC<ShikiHighLighterImplProps> = (props) => {
  const { lang: language, content: value, attrs, highlighter } = props

  use(
    useMemo(async () => {
      async function loadShikiLanguage(
        language: string,
        languageModule: LanguageInput | SpecialLanguage,
      ) {
        if (!highlighter) return
        if (!highlighter.getLoadedLanguages().includes(language)) {
          return highlighter.loadLanguage(languageModule)
        }
      }
      if (!language) return
      const importFn = bundledLanguages[language as BundledLanguage]
      if (!importFn) return
      return loadShikiLanguage(language || '', importFn)
    }, [highlighter, language]),
  )
  const highlightedHtml = useMemo(
    () =>
      shiki(highlighter, {
        attrs: attrs || '',

        // code: `${value.split('\n')[0].repeat(10)} // [!code highlight]\n${value}`,
        code: value,
        lang: language ? language.toLowerCase() : '',
      }),
    [attrs, highlighter, language, value],
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

export const ShikiHighLighter: FC<ShikiProps> = (props) => {
  const highlighter = use(codeHighlighterPromise)

  if (!highlighter) return null

  return <ShikiHighLighterImpl {...props} highlighter={highlighter} />
}
