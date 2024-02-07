'use client'

import { useQuery } from '@tanstack/react-query'
import React, { memo, useDeferredValue, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'

import {
  setActivityMediaInfo,
  setActivityProcessInfo,
  useActivity,
} from '~/atoms/activity'
import { ImpressionView } from '~/components/common/ImpressionTracker'
import { FloatPopover } from '~/components/ui/float-popover'
import { softBouncePreset } from '~/constants/spring'
import { TrackerAction } from '~/constants/tracker'
import { usePageIsActive } from '~/hooks/common/use-is-active'
import { apiClient } from '~/lib/request'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

// autocorrect: false
const appDescription = {
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
  Infuse: '看片',
  kitty: '撸猫',
  IINA: '看片',
  Warp: '耍杂技',
  'Adobe Photoshop 2023': '抠图',
  'Microsoft Word': '码字',
  'Microsoft Excel': '雕花',
  'Microsoft PowerPoint': '画饼',
  SimplyPiano: '练琴',

  'Microsoft Edge': '看b站',
  umamusume: '启动！',
  WindowsTerminal: 'del /f /s /q c:/ (不是',
  卡拉彼丘: '启动！',
  Yuanshen: '启动！',
} as any

const appLabels: { [app: string]: string } = {
  'Activity Monitor': 'activity',
  'Chrome Canary': 'chrome_canary',
  'Code - Insiders': 'code',
  'Google Chrome Canary': 'chrome_canary',
  'Google Chrome': 'chrome',
  'System Preferences': 'system',
  'System Settings': 'system',
  'Adobe Illustrator 2023': 'illustrator',
  'Adobe Photoshop 2023': 'photoshop',
  'Microsoft Word': 'word',
  'Microsoft Excel': 'excel',
  'Microsoft PowerPoint': 'powerpoint',
  'Microsoft OneNote': 'onenote',
  'Final Cut Pro': 'final_cut',
  'Logic Pro': 'logic',
  'IntelliJ IDEA': 'idea',
  'GitHub Desktop': 'gdtop',
  'Hopper Disassembler': 'hopper',
  IINA: 'iina',
  Warp: 'warp',
  RemNote: 'remnote',
  Goodnotes: 'goodnotes',

  访达: 'finder',
  邮件: 'mail',
  地图: 'maps',
  信息: 'messages',
  音乐: 'music',
  网易云音乐: 'netease',
  备忘录: 'notes',
  Safari浏览器: 'safari',
  微信: 'wechat',
  腾讯会议: 'tencent_meeting',
  Alacritty: 'alacritty',
  Arc: 'arc',
  Chrome: 'chrome',
  Code: 'code',
  Discord: 'discord',
  Figma: 'figma',
  Finder: 'finder',
  Home: 'homekit',
  Infuse: 'infuse',
  Linear: 'linear',
  Mail: 'mail',
  Maps: 'maps',
  Messages: 'messages',
  Music: 'music',
  NetEaseMusic: 'netease',
  Notes: 'notes',
  QQ: 'qq',
  QQ音乐: 'qqmusic',
  Safari: 'safari',
  Slack: 'slack',
  Telegram: 'telegram',
  Typora: 'typora',
  Videos: 'apptv',
  WeChat: 'wechat',
  WebStorm: 'webstorm',
  Xcode: 'xcode',
  iTerm2: 'iterm2',
  kitty: 'kitty',
  TencentMeeting: 'tencent_meeting',
  Lark: 'lark',
  Feishu: 'lark',
  SimplyPiano: 'simply_piano',
  GoLand: 'goland',
  PyCharm: 'pycharm',
  TestFlight: 'tf',
  Playgrounds: 'playgrounds',
  ida64: 'ida64',
  Proxyman: 'proxyman',
  Surge: 'surge',
  Termius: 'termius',
  Thorium: 'thorium',

  cmusic: 'cmusic',

  'Microsoft Edge': 'edge',
  msedge: 'edge',
  firefox: 'firefox',
  idea64: 'idea',
  'Explorer.EXE': 'windows_explorer',
  explorer: 'windows_explorer',
  WindowsTerminal: 'windows_terminal',
  卡拉彼丘: 'calatopia',
  Yuanshen: 'genshin',
  chrome: 'chrome',
  'WINWORD.EXE': 'word',
  'EXCEL.EXE': 'excel',
  'POWERPNT.EXE': 'powerpoint',
  'ONENOTE.EXE': 'onenote',
}
// autocorrect: true

export const Activity = memo(() => {
  const activityConfig = useAppConfigSelector(
    (config) => config.module.activity,
  )
  const { enable = false, endpoint = '/fn/ps/update' } = activityConfig || {}
  const activity = useActivity()

  const isPageActive = usePageIsActive()
  const { data } = useQuery({
    queryKey: ['activity'],
    queryFn: async () => {
      return await apiClient
        .proxy(endpoint)
        .post<{
          processName: string
          processInfo?: {
            name: string
            iconBase64?: string
            iconUrl?: string
            description?: string
          }
          mediaInfo?: {
            title: string
            artist: string
          }
        }>()
        .then((res) => res)
        .catch(() => {
          return {
            processName: '',
            processInfo: undefined,
            mediaInfo: undefined,
          }
        })
    },
    refetchInterval: 1000 * 5 * 60,
    refetchOnMount: 'always',
    retry: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: 'always',
    enabled: enable && isPageActive,
    meta: {
      persist: false,
    },
  })

  useEffect(() => {
    if (!data) return
    if (data.mediaInfo) {
      setActivityMediaInfo(data.mediaInfo)
    } else {
      setActivityMediaInfo(null)
    }
    setActivityProcessInfo({
      name: data.processInfo?.name || data.processName,
      iconBase64: data.processInfo?.iconBase64,
      description: data.processInfo?.description,
    })
  }, [data])

  const ownerName = useAggregationSelector((data) => data.user.name)

  const { process, media } = activity
  const deferredProcess = useDeferredValue(process)
  const processName = deferredProcess?.name || ''
  const processIcon = deferredProcess?.iconBase64 || deferredProcess?.iconUrl

  const renderDescription =
    deferredProcess?.description || appDescription[deferredProcess?.name || '']

  const memoProcessName = useMemo(
    () => ({ processName: processName || '', icon: processIcon }),
    [processIcon, processName],
  )

  return (
    <>
      {!!media && (
        <m.div className="absolute bottom-0 left-0 top-0 z-[10] flex items-center lg:left-[-30px]">
          <div className="absolute inset-0 z-[-1] flex center">
            <div className="h-6 w-6 rounded-md ring-2 ring-red-500 dark:ring-red-400" />
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
          {processName && (
            <m.div
              key={processName}
              className="pointer-events-auto absolute bottom-0 right-0 top-0 z-[10] flex items-center overflow-hidden lg:right-[-25px]"
              initial={{
                opacity: 0.0001,
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
              transition={softBouncePreset}
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
                  <span className="whitespace-pre-line">
                    {ownerName} 正在使用 {processName}
                    {renderDescription ? ` ${renderDescription}` : ''}
                  </span>
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

const ErrorFallback = `data:image/png;base64,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`
const TriggerComponent = memo<{
  processName: string
  icon?: string
}>(({ processName, icon }) => {
  const isBuiltIn = !!appLabels[processName]

  const src = !isBuiltIn && icon ? icon : `/apps/${appLabels[processName]}.png`

  const className = clsx('pointer-events-none select-none', {
    'rounded-md': !isBuiltIn,
  })
  const [error, setError] = React.useState(false)

  return (
    <Image
      width={32}
      height={32}
      src={error ? ErrorFallback : src}
      alt={processName}
      priority
      fetchPriority="low"
      className={className}
      onError={() => setError(true)}
    />
  )
})

TriggerComponent.displayName = 'ActivityIcon'
