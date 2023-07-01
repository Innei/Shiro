'use client'

import { useQuery } from '@tanstack/react-query'
import React, { memo, useMemo, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'
import type { RequestError } from '@mx-space/api-client'

import { FloatPopover } from '~/components/ui/float-popover'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'
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
  'Google Chrome': 'chrome',
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
        .then((res) => res as string)
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
  const ownerName = useAggregationSelector((data) => data.user.name)
  const memoProcessName = useMemo(
    () => ({ processName: processName! }),
    [processName],
  )
  if (!processName) {
    return null
  }
  if (!appLabels[processName]) {
    console.log('Not collected process name: ', processName)
    return null
  }

  return (
    <AnimatePresence mode="popLayout">
      <m.div
        key={processName}
        className="pointer-events-auto relative bottom-0 right-[-25px] top-0 z-[10] flex items-center overflow-hidden md:absolute"
        initial={false}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          opacity: 0.2,
          x: -10,
        }}
      >
        <FloatPopover
          TriggerComponent={TriggerComponent}
          triggerComponentProps={memoProcessName}
          type="tooltip"
        >
          {ownerName} 正在使用 {processName}
        </FloatPopover>
      </m.div>
    </AnimatePresence>
  )
}

const TriggerComponent = memo<{
  processName: string
}>(({ processName }) => {
  return (
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
  )
})

TriggerComponent.displayName = 'ActivityIcon'
