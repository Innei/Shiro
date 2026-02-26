import uniqolor from 'uniqolor'

import { MingcuteStarHalfFill } from '~/components/icons/star'
import { allowedBangumiTypes } from '~/lib/bangumi'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

export const bangumiPlugin: LinkCardPlugin = {
  name: 'bangumi',
  displayName: 'Bangumi',
  priority: 70,
  typeClass: 'media',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'bgm.tv' && url.hostname !== 'bangumi.tv') return null

    const parts = url.pathname.split('/').filter(Boolean)
    if (parts.length < 2) return null

    const [type, realId] = parts
    if (!allowedBangumiTypes.includes(type)) return null

    return {
      id: `${type}/${realId}`,
      fullUrl: url.toString(),
      meta: { type },
    }
  },

  isValidId(id: string): boolean {
    const [type, realId] = id.split('/')
    return allowedBangumiTypes.includes(type) && realId?.length > 0
  },

  async fetch(id: string): Promise<LinkCardData> {
    const [type, realId] = id.split('/')

    const json = await fetch(`/api/bangumi/${type}/${realId}`).then((r) =>
      r.json(),
    )

    let title = ''
    let originalTitle = ''

    if (type === 'subject') {
      if (json.name_cn && json.name_cn !== json.name && json.name_cn !== '') {
        title = json.name_cn
        originalTitle = json.name
      } else {
        title = json.name
        originalTitle = json.name
      }
    } else if (type === 'character' || type === 'person') {
      const { infobox } = json
      infobox.forEach(
        (item: { key: string; value: string | { v: string }[] }) => {
          if (item.key === '简体中文名') {
            title =
              typeof item.value === 'string' ? item.value : item.value[0].v
          } else if (item.key === '别名') {
            const aliases: { v: string }[] = item.value as { v: string }[]
            aliases.forEach((alias: { v: string }) => {
              originalTitle += `${alias.v} / `
            })
            originalTitle = originalTitle.slice(0, -3)
          }
        },
      )
    } else {
      throw new Error('Unknown bangumi type')
    }

    return {
      title: (
        <span className="flex flex-wrap items-end gap-2">
          <span>{title}</span>
          {title !== originalTitle && (
            <span className="text-sm opacity-70">({originalTitle})</span>
          )}
          {type === 'subject' && (
            <span className="inline-flex shrink-0 items-center gap-3 self-center">
              <span className="inline-flex shrink-0 items-center gap-1 self-center text-xs text-orange-400 dark:text-yellow-500">
                <MingcuteStarHalfFill />
                <span className="font-sans font-medium">
                  {json.rating.score > 0 && json.rating.score.toFixed(1)}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 self-center text-xs text-orange-400 dark:text-yellow-500">
                <i className="i-mingcute-star-line" />
                <span className="font-sans font-medium">
                  {json.collection &&
                    json.collection.on_hold +
                      json.collection.dropped +
                      json.collection.wish +
                      json.collection.collect +
                      json.collection.doing}
                </span>
              </span>
            </span>
          )}
          {(type === 'character' || type === 'person') && (
            <span className="inline-flex shrink-0 items-center gap-1 self-center text-xs text-orange-400 dark:text-yellow-500">
              <i className="i-mingcute-star-line" />
              <span className="font-sans font-medium">
                {json.stat.collects > 0 && json.stat.collects}
              </span>
            </span>
          )}
        </span>
      ),
      desc: (
        <span className="line-clamp-none overflow-visible whitespace-pre-wrap">
          {json.summary}
        </span>
      ),
      image: json.images.grid,
      color: uniqolor(title, {
        saturation: [30, 35],
        lightness: [60, 70],
      }).color,
      classNames: {
        image:
          type === 'subject'
            ? 'self-start h-[70px]! w-[50px]!'
            : 'self-start h-[50px]! w-[50px]!',
        cardRoot: 'w-full! flex-row-reverse!',
      },
    }
  },
}
