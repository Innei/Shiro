import uniqolor from 'uniqolor'

import { MingcuteStarHalfFill } from '~/components/icons/star'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

const TMDB_LANGUAGE_BY_LOCALE: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en-US',
  ja: 'ja-JP',
}

const getCurrentLocale = () => {
  // Prefer app locale (next-intl sets <html lang="...">)
  if (typeof document !== 'undefined') {
    const lang = document.documentElement?.lang?.trim()
    if (lang) return lang
  }

  // Fallback: parse from URL pathname segment
  if (typeof window !== 'undefined') {
    const firstSegment = window.location.pathname
      .split('/')
      .find((s) => s.length > 0)
    if (firstSegment) return firstSegment
  }

  return 'en'
}

export const tmdbPlugin: LinkCardPlugin = {
  name: 'tmdb',
  displayName: 'The Movie Database',
  priority: 70,
  typeClass: 'media',

  featureGate: {
    featureKey: 'tmdb',
    mustBeEnabled: true,
  },

  matchUrl(url: URL): UrlMatchResult | null {
    if (!url.hostname.includes('themoviedb.org')) return null

    const parts = url.pathname.split('/').filter(Boolean)
    if (parts.length < 2) return null

    const [type, realId] = parts
    const canParsedTypes = ['tv', 'movie']
    if (!canParsedTypes.includes(type) || !realId) return null

    return {
      id: `${type}/${realId}`,
      fullUrl: url.toString(),
      meta: { type },
    }
  },

  isValidId(id: string): boolean {
    const [type, realId] = id.split('/')
    const canParsedTypes = ['tv', 'movie']
    return canParsedTypes.includes(type) && realId?.length > 0
  },

  async fetch(id: string): Promise<LinkCardData> {
    const [type, realId] = id.split('/')
    const locale = getCurrentLocale()
    const userLanguage =
      TMDB_LANGUAGE_BY_LOCALE[locale] ||
      (typeof navigator !== 'undefined' ? navigator.language : 'en-US') ||
      'en-US'

    const json = await fetch(
      `/api/tmdb/${type}/${realId}?language=${userLanguage}`,
    ).then((r) => r.json())

    const title = type === 'tv' ? json.name : json.title
    const originalTitle =
      type === 'tv' ? json.original_name : json.original_title

    return {
      title: (
        <span className="flex flex-wrap items-end gap-2">
          <span>{title}</span>
          {title !== originalTitle && (
            <span className="text-sm opacity-70">({originalTitle})</span>
          )}
          <span className="inline-flex shrink-0 items-center gap-1 self-center text-xs text-orange-400 dark:text-yellow-500">
            <MingcuteStarHalfFill />
            <span className="font-sans font-medium">
              {json.vote_average > 0 && json.vote_average.toFixed(1)}
            </span>
          </span>
        </span>
      ),
      desc: (
        <span className="line-clamp-none overflow-visible whitespace-pre-wrap">
          {json.overview}
        </span>
      ),
      image: `https://image.tmdb.org/t/p/w500${json.poster_path}`,
      color: uniqolor(title || originalTitle || id, {
        saturation: [30, 35],
        lightness: [60, 70],
      }).color,
      classNames: {
        image: 'self-start h-[75px]! w-[50px]!',
        cardRoot: 'w-full! flex-row-reverse!',
      },
    }
  },
}
