import { getHighlighter, setCDN } from 'shiki'

export const renderCodeHighlighter = async (
  code: string,
  lang: string,
  theme: string,
) => {
  setCDN('https://fastly.jsdelivr.net/npm/shiki@0.14.5/')
  return await getHighlighter({
    langs: [lang as any],
    theme,
  }).then((highlighter) => {
    return highlighter.codeToHtml(code, {
      lang,
    })
  })
}
