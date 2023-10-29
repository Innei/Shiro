import { BilibiliIcon } from '~/components/icons/platform/BilibiliIcon'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { IcBaselineTelegram } from '~/components/icons/platform/Telegram'
import { TwitterIcon } from '~/components/icons/platform/Twitter'
import { WikipediaIcon } from '~/components/icons/platform/WikipediaIcon'
import { SimpleIconsZhihu } from '~/components/icons/platform/ZhihuIcon'
import { clsxm } from '~/lib/helper'
import {
  isBilibiliUrl,
  isGithubUrl,
  isTelegramUrl,
  isTwitterUrl,
  isWikipediaUrl,
  isZhihuUrl,
} from '~/lib/link-parser'

const prefixToIconMap = {
  GH: <GitHubBrandIcon className="text-[#1D2127] dark:text-[#FFFFFF]" />,
  TW: <TwitterIcon className="text-[#1DA1F2]" />,
  TG: <IcBaselineTelegram className="text-[#2AABEE]" />,
  BL: <BilibiliIcon className="text-[#469ECF]" />,
  ZH: <SimpleIconsZhihu className="text-[#0084FF]" />,
  WI: <WikipediaIcon className="text-current" />,
}

const getUrlSource = (url: URL) => {
  const map = [
    {
      type: 'GH',
      test: isGithubUrl,
    },
    {
      type: 'TW',
      test: isTwitterUrl,
    },
    {
      type: 'TG',
      test: isTelegramUrl,
    },
    {
      type: 'BL',
      test: isBilibiliUrl,
    },
    {
      type: 'ZH',
      test: isZhihuUrl,
    },
    {
      type: 'WI',
      test: isWikipediaUrl,
    },
  ]

  return map.find((item) => item.test(url))?.type
}

type FaviconProps =
  | {
      source: string
    }
  | {
      href: string
    }
export const Favicon: Component<FaviconProps> = (props) => {
  // @ts-expect-error
  const { source, href, className } = props
  let nextSource = source as keyof typeof prefixToIconMap

  try {
    if (href) {
      const url = new URL(href)
      nextSource = getUrlSource(url) ?? source
    }
  } catch {
    /* empty */
  }

  if (!prefixToIconMap[nextSource]) return null

  return (
    <span className={clsxm('mr-1 align-text-bottom [&_svg]:inline', className)}>
      {prefixToIconMap[nextSource]}
    </span>
  )
}
