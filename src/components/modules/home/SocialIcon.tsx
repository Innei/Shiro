/* eslint-disable react/jsx-key */
import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'

import { BilibiliIcon } from '~/components/icons/platform/BilibiliIcon'
import { NeteaseCloudMusicIcon } from '~/components/icons/platform/NeteaseIcon'
import { XIcon } from '~/components/icons/platform/XIcon'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'

interface SocialIconProps {
  type: string
  id: string
}

const type2Copy = {
  github: 'GitHub',
  twitter: 'Twitter',
  telegram: 'Telegram',
  mail: 'Email',
  rss: 'RSS',
  email: 'Email',
  feed: 'RSS',
  bilibili: '哔哩哔哩',
  netease: '网易云音乐',

  qq: 'QQ',
  wechat: '微信',
  weibo: '微博',

  x: 'X',
} as any
const icons = new Set(Object.keys(type2Copy))

const iconSet: Record<
  string,
  [string, ReactNode, string, (id: string) => string]
> = {
  github: [
    'Github',
    <i className="icon-[mingcute--github-line]" />,
    '#181717',
    (id) => `https://github.com/${id}`,
  ],
  twitter: [
    'Twitter',
    <i className="icon-[mingcute--twitter-line]" />,
    '#1DA1F2',
    (id) => `https://twitter.com/${id}`,
  ],
  x: ['x', <XIcon />, 'rgba(36,46,54,1.00)', (id) => `https://x.com/${id}`],
  telegram: [
    'Telegram',
    <i className="icon-[mingcute--telegram-line]" />,
    '#0088cc',
    (id) => `https://t.me/${id}`,
  ],
  mail: [
    'Email',
    <i className="icon-[mingcute--mail-line]" />,
    '#D44638',
    (id) => `mailto:${id}`,
  ],
  rss: [
    'RSS',
    <i className="icon-[mingcute--rss-line]" />,
    '#FFA500',
    (id) => id,
  ],
  bilibili: [
    '哔哩哔哩',
    <BilibiliIcon />,
    '#00A1D6',
    (id) => `https://space.bilibili.com/${id}`,
  ],
  netease: [
    '网易云音乐',
    <NeteaseCloudMusicIcon />,
    '#C20C0C',
    (id) => `https://music.163.com/#/user/home?id=${id}`,
  ],
  qq: [
    'QQ',
    <i className="icon-[mingcute--qq-fill]" />,
    '#1e6fff',
    (id) => `https://wpa.qq.com/msgrd?v=3&uin=${id}&site=qq&menu=yes`,
  ],
  wechat: [
    '微信',
    <i className="icon-[mingcute--wechat-fill]" />,
    '#2DC100',
    (id) => id,
  ],
  weibo: [
    '微博',
    <i className="icon-[mingcute--weibo-line]" />,
    '#E6162D',
    (id) => `https://weibo.com/${id}`,
  ],
}

export const isSupportIcon = (icon: string) => icons.has(icon)
export const SocialIcon = memo((props: SocialIconProps) => {
  const { id, type } = props

  const [name, Icon, iconBg, hrefFn] = useMemo(() => {
    const [name, Icon, iconBg, hrefFn] = iconSet[type] || []
    return [name, Icon, iconBg, hrefFn]
  }, [type])

  if (!name) return null
  const href = hrefFn(id)

  return (
    <FloatPopover
      type="tooltip"
      triggerElement={
        <MotionButtonBase
          className="flex aspect-square h-10 w-10 rounded-full text-2xl text-white center"
          style={{
            background: iconBg,
          }}
        >
          <a
            target="_blank"
            href={href}
            className="flex center"
            rel="noreferrer"
          >
            {Icon}
          </a>
        </MotionButtonBase>
      }
    >
      {type2Copy[type] || ''}
    </FloatPopover>
  )
})
SocialIcon.displayName = 'SocialIcon'
