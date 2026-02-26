import type { Locale } from '~/i18n/config'
import { defaultLocale, locales } from '~/i18n/config'

/**
 * Map app locale -> SEO hreflang code.
 * - Use BCP 47 where we want region specificity (zh-CN).
 */
export const HREFLANG_BY_LOCALE: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
}

export const buildLocalePrefixedPath = (locale: Locale, pathname: string) => {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  return locale === defaultLocale ? normalized : `/${locale}${normalized}`
}

export const buildLanguageAlternates = (
  pathname: string,
  includeLocales: readonly Locale[] = locales,
) => {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  return Object.fromEntries(
    includeLocales.map((loc) => [
      HREFLANG_BY_LOCALE[loc],
      buildLocalePrefixedPath(loc, normalized),
    ]),
  )
}

export const getSupportedLocalesFromTranslations = (input?: {
  sourceLang?: string | null
  availableTranslations?: string[] | null
}): Locale[] => {
  const supported = new Set(locales as readonly string[])
  const set = new Set<Locale>()

  const addIfSupported = (code?: string | null) => {
    if (!code) return
    if (supported.has(code)) set.add(code as Locale)
  }

  addIfSupported(input?.sourceLang ?? defaultLocale)
  input?.availableTranslations?.forEach((code) => addIfSupported(code))

  // Keep deterministic order (matching `locales`)
  return locales.filter((l) => set.has(l))
}

export const stripLocaleFromPathname = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] && (locales as readonly string[]).includes(parts[0])) {
    return `/${parts.slice(1).join('/')}`
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}
