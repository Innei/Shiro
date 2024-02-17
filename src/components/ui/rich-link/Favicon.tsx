import { BilibiliIcon } from '~/components/icons/platform/BilibiliIcon'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { CibMozilla } from '~/components/icons/platform/Moz'
import { VscodeIconsFileTypeNpm } from '~/components/icons/platform/NpmIcon'
import { IcBaselineTelegram } from '~/components/icons/platform/Telegram'
import { SimpleIconsThemoviedatabase } from '~/components/icons/platform/TheMovieDB'
import { TwitterIcon } from '~/components/icons/platform/Twitter'
import { WikipediaIcon } from '~/components/icons/platform/WikipediaIcon'
import { SimpleIconsZhihu } from '~/components/icons/platform/ZhihuIcon'
import { clsxm } from '~/lib/helper'
import {
  isBilibiliUrl,
  isGithubUrl,
  isMozillaUrl,
  isNpmUrl,
  isTelegramUrl,
  isTMDBUrl,
  isTwitterUrl,
  isWikipediaUrl,
  isZhihuUrl,
} from '~/lib/link-parser'

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
] as const

const type2IconMap = map.reduce(
  (acc, cur) => {
    acc[cur.type] = cur.icon
    return acc
  },
  {} as Record<string, (typeof map)[number]['icon']>,
)

type AllType = (typeof map)[number]['type']
const getUrlSource = (url: URL) => {
  return map.find((item) => item.test(url))?.type
}

type FaviconProps =
  | {
      source: string
    }
  | {
      href: string
    }
  | {
      source: AllType
    }
export const Favicon: Component<FaviconProps> = (props) => {
  // @ts-expect-error
  const { source, href, className } = props
  let nextSource = source as AllType

  try {
    if (href) {
      const url = new URL(href)
      nextSource = getUrlSource(url) ?? source
    }
  } catch {
    /* empty */
  }

  if (!type2IconMap[nextSource]) return null

  return (
    <span
      className={clsxm(
        'mr-1 inline-flex [&_svg]:inline [&_svg]:!h-[0.8rem]',
        className,
      )}
    >
      {type2IconMap[nextSource]}
    </span>
  )
}
