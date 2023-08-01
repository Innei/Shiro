import { BilibiliIcon } from '~/components/icons/platform/BilibiliIcon'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { IcBaselineTelegram } from '~/components/icons/platform/Telegram'
import { TwitterIcon } from '~/components/icons/platform/Twitter'
import { clsxm } from '~/lib/helper'
import {
  isBilibiliUrl,
  isGithubUrl,
  isTelegramUrl,
  isTwitterUrl,
} from '~/lib/link-parser'

const prefixToIconMap = {
  GH: <GitHubBrandIcon className="text-[#1D2127] dark:text-[#FFFFFF]" />,
  TW: <TwitterIcon className="text-[#1DA1F2]" />,
  TG: <IcBaselineTelegram className="text-[#2AABEE]" />,
  BL: <BilibiliIcon className="text-[#469ECF]" />,
} as any

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
  let nextSource = source

  try {
    if (href) {
      const url = new URL(href)
      switch (true) {
        case isGithubUrl(url): {
          nextSource = 'GH'
          break
        }

        case isTwitterUrl(url): {
          nextSource = 'TW'
          break
        }
        case isTelegramUrl(url): {
          nextSource = 'TG'
          break
        }

        case isBilibiliUrl(url): {
          nextSource = 'BL'
        }
      }
    }
  } catch {}

  if (!prefixToIconMap[nextSource]) return null

  return (
    <span className={clsxm('mr-1 [&_svg]:inline', className)}>
      {prefixToIconMap[nextSource]}
    </span>
  )
}
