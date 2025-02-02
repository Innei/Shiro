import dynamic from 'next/dynamic'
import type { FC } from 'react'

import { IcBaselineTelegram } from '~/components/icons/platform/Telegram'
import { TwitterIcon } from '~/components/icons/platform/Twitter'
import { toast } from '~/lib/toast'
import { getAggregationData } from '~/providers/root/aggregation-data-provider'

const QRCodeSVG = dynamic(
  () => import('qrcode.react').then((module) => module.QRCodeSVG),
  { ssr: false },
)

const shareList = [
  {
    name: 'Twitter',
    icon: <TwitterIcon />,
    onClick: (data: ShareData) => {
      window.open(
        `https://twitter.com/intent/tweet?url=${data.url}&text=${
          data.text
        }&via=${getAggregationData()?.seo.title}`,
      )
    },
  },
  {
    name: 'Telegram',
    icon: <IcBaselineTelegram className="text-[#2AABEE]" />,
    onClick: (data: ShareData) => {
      window.open(
        `https://telegram.me/share/url?url=${data.url}&text=${data.text}`,
      )
    },
  },

  {
    name: '复制链接',
    icon: <i className="i-mingcute-copy-fill" />,
    onClick: (data: ShareData) => {
      navigator.clipboard.writeText(data.url)
      toast.success('已复制到剪贴板')
    },
  },
]

interface ShareData {
  url: string
  title: string
  text: string
}

export const ShareModal: FC<ShareData> = ({ url, text, title }) => {
  return (
    <div className="relative grid grid-cols-[200px_auto] gap-5">
      <div className="qrcode inline-block size-[200px] bg-gray-200/80 dark:bg-zinc-800/90">
        <QRCodeSVG
          value={url}
          className="aspect-square w-[200px]"
          height={200}
          width={200}
        />
      </div>
      <div className="share-options flex flex-col gap-2">
        分享到...
        <ul className="w-[200px] flex-col gap-2 [&>li]:flex [&>li]:items-center [&>li]:space-x-2">
          {shareList.map(({ name, icon, onClick }) => (
            <li
              key={name}
              className="flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 text-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={`Share to ${name}`}
              role="button"
              onClick={() => onClick({ url, text, title })}
            >
              {icon}
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
