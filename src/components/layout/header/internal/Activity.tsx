'use client'

import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { m } from 'framer-motion'
import Image from 'next/image'
import type { RequestError } from '@mx-space/api-client'

import { apiClient } from '~/utils/request'

// autocorrect: false
const appLabels: { [app: string]: string } = {
  Slack: 'slack',
  Arc: 'arc',
  Code: 'code',
  WebStorm: 'webstorm',
  Linear: 'linear',
  Figma: 'figma',
  Telegram: 'telegram',
  WeChat: 'wechat',
  Discord: 'discord',
  Mail: 'mail',
  Safari: 'safari',
  Music: 'music',
  Finder: 'finder',
  Messages: 'messages',
  QQ: 'qq',
  Chrome: 'chrome',
  'Chrome Canary': 'chrome_canary',
  QQ音乐: 'qq_music',
  NeteaseMusic: 'netease',
  iTerm2: 'iterm2',
  Xcode: 'xcode',
}
// autocorrect: true
export function Activity() {
  const [isEnabled, setIsEnabled] = useState(true)

  const { data: processName } = useQuery(
    ['activity'],
    async () => {
      return await apiClient.proxy.fn.ps.update
        .post<string>()
        .catch((err: RequestError) => {
          err.status === 404 && setIsEnabled(false)
          return ''
        })
    },
    {
      refetchInterval: 5000,
      retry: false,
      enabled: isEnabled,
    },
  )

  if (!processName) {
    return null
  }
  if (!appLabels[processName]) {
    console.log('Not collected process name: ', processName)
    return null
  }

  return (
    <div className="pointer-events-auto relative bottom-0 right-[-25px] top-0 flex items-center md:absolute">
      <m.div
        className="absolute left-1 top-1 h-6 w-6 select-none rounded-[6px] bg-zinc-500/10 dark:bg-zinc-200/10"
        animate={{ opacity: [0, 0.65, 0], scale: [1, 1.4, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
      <Image
        width={32}
        height={32}
        src={`/apps/${appLabels[processName]}.png`}
        alt={processName}
        priority
        fetchPriority="high"
        unoptimized
        className="pointer-events-none select-none"
      />
    </div>
  )
}
