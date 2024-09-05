// import { bundledLanguages } from 'shiki/langs'

export const parseFilenameFromAttrs = (attrs: string) => {
  // filename=""

  const match = attrs.match(/filename="([^"]+)"/)
  if (match) {
    return match[1]
  }
  return null
}

export const parseShouldCollapsedFromAttrs = (attrs: string) =>
  // collapsed
  attrs.includes('collapsed') || !attrs.includes('expand')

// const shikiSupportLangSet = new Set(Object.keys(bundledLanguages))
export const isSupportedShikiLang = (lang: string) =>
  // require esm error, fuck nextjs 14.12.x
  // @see https://github.com/vercel/next.js/issues/64434
  // return  shikiSupportLangSet.has(lang)
  true
