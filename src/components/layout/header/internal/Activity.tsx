'use client'

import { useQuery } from '@tanstack/react-query'
import React, { memo, useDeferredValue, useEffect, useMemo } from 'react'
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

const getAppName = (processName: string) => {
  return appLabels[processName] || processName
}
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
  const renderProcessName = getAppName(processName)

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
          {renderProcessName && (
            <m.div
              key={renderProcessName}
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
                    {ownerName} 正在使用 {renderProcessName}
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
const TriggerComponent = memo<{
  processName: string
  icon?: string
}>(({ processName, icon }) => {
  const isBuiltIn = !!appLabels[processName]

  if (!isBuiltIn) {
    return (
      <img
        width={32}
        height={32}
        src={icon}
        alt={processName}
        className="pointer-events-none select-none overflow-hidden rounded-md"
      />
    )
  }

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
