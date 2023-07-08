import {
  CodiconGithubInverted,
  IcBaselineTelegram,
  MdiTwitter,
} from '~/components/icons/menu-collection'
import { clsxm } from '~/lib/helper'
import { isGithubUrl, isTelegramUrl, isTwitterUrl } from '~/lib/link-parser'

const prefixToIconMap = {
  GH: <CodiconGithubInverted className="text-[#1D2127] dark:text-[#FFFFFF]" />,
  TW: <MdiTwitter className="text-[#1DA1F2]" />,
  TG: <IcBaselineTelegram className="text-[#2AABEE]" />,
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
