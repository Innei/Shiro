'use client'

import { useQuery } from '@tanstack/react-query'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'
import type { RequestError } from '@mx-space/api-client'

import {
  setActivityMediaInfo,
  setActivityProcessName,
  useActivity,
} from '~/atoms/activity'
import { FloatPopover } from '~/components/ui/float-popover'
import { apiClient } from '~/lib/request'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

// autocorrect: false
const appDescrption = {
  Typora: '水文',
  Xcode: '敲榔头',
  iTerm2: '耍杂技',
  NeteaseMusic: '听歌',
  QQ音乐: '听歌',
  Chrome: '冲浪',
  'Chrome Canary': '调试',
  QQ: '水群',
  Messages: '看验证码',
  Code: 'Restart TS Server',
  Finder: '发呆',
} as any
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
  'Google Chrome Canary': 'chrome_canary',
  QQ音乐: 'qq_music',
  NetEaseMusic: 'netease',
  iTerm2: 'iterm2',
  Xcode: 'xcode',
  Typora: 'typora',

  cmusic: 'cmusic',
}
// autocorrect: true
export function Activity() {
  const [isEnabled, setIsEnabled] = useState(true)

  const activity = useActivity()

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
      refetchInterval: 1000 * 5 * 60,
      refetchOnMount: 'always',
      retry: false,
      enabled: isEnabled,
      meta: {
        persist: false,
      },
    },
  )

  useEffect(() => {
    if (!data) return
    data.mediaInfo && setActivityMediaInfo(data.mediaInfo)
    setActivityProcessName(data.processName)
  }, [data])

  const ownerName = useAggregationSelector((data) => data.user.name)
  const memoProcessName = useMemo(
    () => ({ processName: data?.processName || '' }),
    [data?.processName],
  )
  if (!data) {
    return null
  }
  const { processName, media } = activity
  if (!appLabels[processName]) {
    console.log('Not collected process name: ', processName)
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
            strategy="fixed"
          >
            {ownerName} 正在听 {media.title} - {media.artist}
          </FloatPopover>
        </m.div>
      )}

      {!!appLabels[processName] && (
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
            strategy="fixed"
          >
            {ownerName} 正在使用 {processName}
            {appDescrption[processName] ? ` ${appDescrption[processName]}` : ''}
          </FloatPopover>
        </m.div>
      )}
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
