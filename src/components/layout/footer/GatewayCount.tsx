'use client'

import { useOnlineCount } from '~/atoms'
import { ImpressionView } from '~/components/common/ImpressionTracker'
import { Divider } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import { TrackerAction } from '~/constants/tracker'
import { usePageIsActive } from '~/hooks/common/use-is-active'
import { useSocketIsConnect } from '~/socket/hooks'

export const GatewayCount = () => {
  return (
    <FloatPopover
      as="span"
      TriggerComponent={GatewayCountTrigger}
      type="tooltip"
      wrapperClassName="cursor-help"
    >
      <div className="space-y-2 leading-relaxed">
        <p className="flex items-center space-x-1 opacity-80">
          <i className="icon-[mingcute--question-line]" />
          <span className="font-medium">这是如何实现的？</span>
        </p>
        <p>
          当你打开这个页面时，会自动建立 WebSocket
          连接，当成功连接后服务器会推送当前浏览页面的人数。
        </p>
        <p>
          WebSocket
          用于通知站点，站长在站点的实时活动，包括不限于文章的发布和更新。
        </p>

        <Divider />

        <p>
          当前 Socket 状态： <ConnectedIndicator />
        </p>
      </div>
    </FloatPopover>
  )
}

const ConnectedIndicator = () => {
  const connected = useSocketIsConnect()

  return (
    <div className="inline-flex items-center">
      <ImpressionView
        trackerMessage="socket_status"
        action={TrackerAction.Impression}
      />
      {connected ? (
        <>
          <span className="absolute h-5 w-5">
            <span className="absolute inset-0 z-[3] m-auto flex h-3 w-3 rounded-full bg-green-400" />
            <span className="absolute inset-0 z-[2] m-auto flex h-4 w-4 rounded-full bg-green-300" />
            <span className="relative z-[1] flex h-5 w-5 rounded-full bg-green-200 center" />
          </span>

          <span className="ml-6">已连接</span>
        </>
      ) : (
        <>
          <span className="absolute h-5 w-5">
            <span className="absolute inset-0 z-[3] m-auto flex h-3 w-3 rounded-full bg-red-400" />
            <span className="absolute inset-0 z-[2] m-auto flex h-4 w-4 rounded-full bg-red-300" />
            <span className="relative z-[1] flex h-5 w-5 rounded-full bg-red-200 center" />
          </span>

          <span className="ml-6">未连接</span>
        </>
      )}
    </div>
  )
}

const GatewayCountTrigger = () => {
  const isActive = usePageIsActive()
  const count = useOnlineCount()

  if (!isActive) return null
  return (
    <span>
      正在被 <NumberSmoothTransition>{count}</NumberSmoothTransition> 人看爆
    </span>
  )
}
