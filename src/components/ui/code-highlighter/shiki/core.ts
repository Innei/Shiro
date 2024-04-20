import type { BundledLanguage } from 'shiki/langs'
import type { BundledTheme } from 'shiki/themes'
import type { CodeToHastOptions, HighlighterCore } from 'shiki/types.mjs'

import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'

export function codeHighlighter(
  highlighter: HighlighterCore,
  {
    lang,
    attrs,
    code,
  }: {
    lang: string
    attrs: string
    code: string
  },
) {
  const codeOptions: CodeToHastOptions<BundledLanguage, BundledTheme> = {
    lang,
    meta: {
      __raw: attrs,
    },
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  }

  return highlighter.codeToHtml(code, {
    ...codeOptions,
    transformers: [
      ...(codeOptions.transformers || []),
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerMetaHighlight(),
    ],
  })
}
