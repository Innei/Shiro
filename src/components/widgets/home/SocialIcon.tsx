import { memo, useMemo } from 'react'

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
} as any
const icons = new Set(Object.keys(type2Copy))
export const isSupportIcon = (icon: string) => icons.has(icon)
export const SocialIcon = memo((props: SocialIconProps) => {
  const { id, type } = props
  const Icon = useMemo(() => {
    switch (type) {
      case 'github': {
        return <i className="icon-[mingcute--github-line]" />
      }
      case 'twitter': {
        return <i className="icon-[mingcute--twitter-line]" />
      }

      case 'telegram': {
        return <i className="icon-[mingcute--telegram-line]" />
      }
      case 'mail':
      case 'email': {
        return <i className="icon-[mingcute--mail-line]" />
      }
      case 'rss':
      case 'feed': {
        return <i className="icon-[mingcute--rss-line]" />
      }
    }

    return null
  }, [type])
  const href = useMemo(() => {
    switch (type) {
      case 'github': {
        return `https://github.com/${id}`
      }
      case 'twitter': {
        return `https://twitter.com/${id}`
      }

      case 'telegram': {
        return `https://t.me/${id}`
      }
      case 'mail':
      case 'email': {
        return `mailto:${id}`
      }
      case 'rss':
      case 'feed': {
        return id
      }
    }
  }, [id, type])

  const iconBg = useMemo(() => {
    switch (type) {
      case 'github': {
        return '#181717'
      }
      case 'twitter': {
        return '#1DA1F2'
      }

      case 'telegram': {
        return '#0088cc'
      }
      case 'mail':
      case 'email': {
        return '#D44638'
      }
      case 'rss':
      case 'feed': {
        return '#FFA500'
      }
    }
  }, [type])

  if (!Icon) return null

  return (
    <FloatPopover
      type="tooltip"
      TriggerComponent={() => (
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
      )}
    >
      {type2Copy[type] || ''}
    </FloatPopover>
  )
})
SocialIcon.displayName = 'SocialIcon'
