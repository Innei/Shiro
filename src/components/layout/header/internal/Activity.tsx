'use client'

import { useQuery } from '@tanstack/react-query'
import React, { memo, useMemo, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'
import type { RequestError } from '@mx-space/api-client'

import { FloatPopover } from '~/components/ui/float-popover'
import { apiClient } from '~/lib/request'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

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

  cmusic: 'cmusic',
}
// autocorrect: true
export function Activity() {
  const [isEnabled, setIsEnabled] = useState(true)

  const { data } = useQuery(
    ['activity'],
    async () => {
      return await apiClient.proxy.fn.ps.update
        .post<{
          processName: string
          mediaInfo?: {
            title: string
            artist: string
          }
        }>()
        .then((res) => res)
        .catch((err: RequestError) => {
          err.status === 404 && setIsEnabled(false)
          return { processName: '', mediaInfo: undefined }
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
    () => ({ processName: data?.processName || '' }),
    [data?.processName],
  )
  if (!data) {
    return null
  }
  const { processName, mediaInfo: media } = data
  if (!appLabels[processName]) {
    console.log('Not collected process name: ', processName)
    return null
  }

  return (
    <AnimatePresence>
      {!!media && (
        <m.div className="absolute bottom-0 left-0 top-0 z-[10] flex items-center md:left-[-30px]">
          <div className="absolute inset-0 z-[-1] flex center">
            <div className="h-6 w-6 animate-ping rounded-md ring-2 ring-uk-red-dark" />
          </div>
          <FloatPopover
            TriggerComponent={TriggerComponent}
            triggerComponentProps={cMusicProps}
            type="tooltip"
          >
            {ownerName} 正在听 {media.title} - {media.artist}
          </FloatPopover>
        </m.div>
      )}

      <m.div
        key={processName}
        className="pointer-events-auto absolute bottom-0 right-0 top-0 z-[10] flex animate-pulse items-center overflow-hidden md:right-[-25px]"
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
const cMusicProps = { processName: 'cmusic' }
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
