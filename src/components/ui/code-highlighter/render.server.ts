'use server'

import { getHighlighter } from 'shiki'
import type { Theme } from 'shiki'

export const renderCodeHighlighter = async (
  code: string,
  lang: string,
  theme: Theme,
) => {
  return await getHighlighter({
    langs: [lang as any],
    theme,
  }).then((highlighter) => {
    return highlighter.codeToHtml(code, {
      lang,
    })
  })
}
