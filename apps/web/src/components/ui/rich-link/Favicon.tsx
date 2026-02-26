'use client'

import { useEffect, useState } from 'react'

import { BilibiliIcon } from '~/components/icons/platform/BilibiliIcon'
import { SimpleIconsFigma } from '~/components/icons/platform/FigmaIcon'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { CibMozilla } from '~/components/icons/platform/Moz'
import { VscodeIconsFileTypeNpm } from '~/components/icons/platform/NpmIcon'
import { IcBaselineTelegram } from '~/components/icons/platform/Telegram'
import { SimpleIconsThemoviedatabase } from '~/components/icons/platform/TheMovieDB'
import { TwitterIcon } from '~/components/icons/platform/Twitter'
import { WikipediaIcon } from '~/components/icons/platform/WikipediaIcon'
import { SimpleIconsXiaohongshu } from '~/components/icons/platform/XiaoHongShuIcon'
import { SimpleIconsZhihu } from '~/components/icons/platform/ZhihuIcon'
import { clsxm } from '~/lib/helper'
import {
  isBilibiliUrl,
  isFigmaUrl,
  isGithubUrl,
  isMozillaUrl,
  isNpmUrl,
  isTelegramUrl,
  isTMDBUrl,
  isTwitterUrl,
  isWikipediaUrl,
  isXiaoHongShuUrl,
  isZhihuUrl,
} from '~/lib/link-parser'

const FAVICON_VARIANTS = [
  '/favicon.ico',
  '/favicon.png',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png',
]

const useFaviconProbe = (hostname: string | null) => {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!hostname) {
      setFaviconUrl(null)
      return
    }

    setIsLoading(true)
    let isCancelled = false

    const probeImage = (url: string): Promise<string | null> => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = () => resolve(null)
        img.src = url
      })
    }

    const probeFavicons = async () => {
      for (const variant of FAVICON_VARIANTS) {
        if (isCancelled) break
        const url = `https://${hostname}${variant}`
        const result = await probeImage(url)
        if (result && !isCancelled) {
          setFaviconUrl(result)
          setIsLoading(false)
          return
        }
      }
      if (!isCancelled) {
        setFaviconUrl(null)
        setIsLoading(false)
      }
    }

    probeFavicons()

    return () => {
      isCancelled = true
    }
  }, [hostname])

  return { faviconUrl, isLoading }
}

const map = [
  {
    type: 'GH',
    icon: <GitHubBrandIcon className="text-[#1D2127] dark:text-[#FFFFFF]" />,
    test: isGithubUrl,
  },
  {
    type: 'TW',
    icon: <TwitterIcon />,
    test: isTwitterUrl,
  },
  {
    type: 'TG',
    icon: <IcBaselineTelegram className="text-[#2AABEE]" />,
    test: isTelegramUrl,
  },
  {
    type: 'BL',
    icon: <BilibiliIcon className="text-[#469ECF]" />,
    test: isBilibiliUrl,
  },
  {
    type: 'ZH',
    icon: <SimpleIconsZhihu className="text-[#0084FF]" />,
    test: isZhihuUrl,
  },
  {
    type: 'WI',
    icon: <WikipediaIcon className="text-current" />,
    test: isWikipediaUrl,
  },
  {
    type: 'TMDB',
    icon: (
      <SimpleIconsThemoviedatabase className="text-[#0D243F] dark:text-[#5CB7D2]" />
    ),
    test: isTMDBUrl,
  },
  {
    type: 'Moz',
    icon: <CibMozilla className="text-[#8cb4ff]" />,
    test: isMozillaUrl,
  },
  {
    type: 'Npm',
    icon: <VscodeIconsFileTypeNpm />,
    test: isNpmUrl,
  },
  {
    type: 'Figma',
    icon: <SimpleIconsFigma className="text-[#A259FF]" />,
    test: isFigmaUrl,
  },
  {
    type: 'XHS',
    icon: <SimpleIconsXiaohongshu className="text-[#FE2442]" />,
    test: isXiaoHongShuUrl,
  },
] as const

const type2IconMap = map.reduce(
  (acc, cur) => {
    acc[cur.type] = cur.icon
    return acc
  },
  {} as Record<string, (typeof map)[number]['icon']>,
)

type AllType = (typeof map)[number]['type']
const getUrlSource = (url: URL) => map.find((item) => item.test(url))?.type

const getHostname = (href: string): string | null => {
  try {
    return new URL(href).hostname
  } catch {
    return null
  }
}

type FaviconProps = (
  | {
      source: string
    }
  | {
      href: string
    }
  | {
      source: AllType
    }
) & {
  noIcon?: boolean
}

const FallbackFavicon: Component<{ href?: string }> = ({ href, className }) => {
  const hostname = href ? getHostname(href) : null
  const { faviconUrl, isLoading } = useFaviconProbe(hostname)

  if (isLoading) {
    return null
  }

  if (faviconUrl) {
    return (
      <span
        className={clsxm(
          'mr-1 inline-flex shrink-0 items-center [&_img]:inline [&_img]:h-[0.9em]! [&_img]:w-[0.9em]!',
          className,
        )}
      >
        <img
          src={faviconUrl}
          alt=""
          className="m-0! rounded-xs object-contain"
        />
      </span>
    )
  }

  return (
    <span
      className={clsxm(
        'mr-1 inline-flex shrink-0 [&_svg]:inline [&_svg]:h-[0.8em]!',
        className,
      )}
    >
      <i className="i-mingcute-globe-line" />
    </span>
  )
}

export const Favicon: Component<FaviconProps> = (props) => {
  // @ts-expect-error
  const { source, href, className, noIcon } = props

  if (noIcon) return null

  let nextSource = source as AllType
  let parsedUrl: URL | null = null

  try {
    if (href) {
      parsedUrl = new URL(href)
      nextSource = getUrlSource(parsedUrl) ?? source
    }
  } catch {
    /* empty */
  }

  if (type2IconMap[nextSource]) {
    return (
      <span
        className={clsxm(
          'mr-1 inline-flex shrink-0 [&_svg]:inline [&_svg]:h-[0.8em]!',
          className,
        )}
      >
        {type2IconMap[nextSource]}
      </span>
    )
  }

  return <FallbackFavicon href={href} className={className} />
}
