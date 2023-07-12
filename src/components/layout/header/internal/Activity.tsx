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
import { ImpressionView } from '~/components/common/ImpressionTracker'
import { FloatPopover } from '~/components/ui/float-popover'
import { softBouncePrest } from '~/constants/spring'
import { TrackerAction } from '~/constants/tracker'
import useDebounceValue from '~/hooks/common/use-debounce-value'
import { usePageIsActive } from '~/hooks/common/use-is-active'
import { apiClient } from '~/lib/request'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

// autocorrect: false
const appDescrption = {
  Typora: '水文',
  Xcode: '玩个锤子',
  iTerm2: '耍杂技',
  NeteaseMusic: '听歌',
  QQ音乐: '听歌',

  'Google Chrome': '冲浪',
  'Google Chrome Canary': '调试',
  QQ: '水群',
  Messages: '看验证码',
  Code: 'Restart TS Server',
  Finder: '发呆',
  Infuse: '看片',
  kitty: '撸猫',
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
  QQ音乐: 'qqmusic',
  NetEaseMusic: 'netease',
  iTerm2: 'iterm2',
  Xcode: 'xcode',
  Typora: 'typora',
  Infuse: 'infuse',
  kitty: 'kitty',

  cmusic: 'cmusic',
}
// autocorrect: true
export const Activity = memo(() => {
  const [isEnabled, setIsEnabled] = useState(true)

  const activity = useActivity()

  const isPageActive = usePageIsActive()
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
          setIsEnabled(false)
          return { processName: '', mediaInfo: undefined }
        })
    },
    {
      refetchInterval: 1000 * 5 * 60,
      refetchOnMount: 'always',
      retry: false,
      enabled: isEnabled && isPageActive,
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
    () => ({ processName: activity?.processName || '' }),
    [activity?.processName],
  )

  const { processName, media } = activity
  const debounceProcess = useDebounceValue(processName, 800)

  if (!appLabels[debounceProcess]) {
    console.log('Not collected process name: ', debounceProcess)
  }

  return (
    <>
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
      {isPageActive && (
        <AnimatePresence>
          {!!appLabels[processName] && (
            <m.div
              key={processName}
              className="pointer-events-auto absolute bottom-0 right-0 top-0 z-[10] flex items-center overflow-hidden md:right-[-25px]"
              initial={{
                opacity: 0.2,
                y: 15,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                opacity: 0,
                x: -10,
              }}
              transition={softBouncePrest}
            >
              <FloatPopover
                TriggerComponent={TriggerComponent}
                triggerComponentProps={memoProcessName}
                type="tooltip"
                strategy="fixed"
              >
                <ImpressionView
                  action={TrackerAction.Impression}
                  trackerMessage="Activity"
                >
                  {ownerName} 正在使用 {processName}
                  {appDescrption[processName]
                    ? ` ${appDescrption[processName]}`
                    : ''}
                </ImpressionView>
              </FloatPopover>
            </m.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
})
Activity.displayName = 'Activity'
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
      fetchPriority="low"
      className="pointer-events-none select-none"
    />
  )
})

TriggerComponent.displayName = 'ActivityIcon'
