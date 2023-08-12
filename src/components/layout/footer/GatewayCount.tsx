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
          <span
            className="absolute h-5 w-5"
            style={{
              background: `radial-gradient(45.91% 45.91% at 49.81% 54.09%, #00FC47 7.13%, rgba(174, 244, 194, 0.46) 65.83%, rgba(252, 252, 252, 0.00) 100%)`,
            }}
          />

          <span className="ml-6">已连接</span>
        </>
      ) : (
        <>
          <span
            className="absolute h-5 w-5"
            style={{
              background: `radial-gradient(45.91% 45.91% at 49.81% 54.09%, #FC0000 7.13%, rgba(244, 174, 174, 0.46) 65.83%, rgba(252, 252, 252, 0.00) 100%)`,
            }}
          />

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
    <span key={count}>
      正在被{' '}
      <span>
        <NumberSmoothTransition>{count}</NumberSmoothTransition>
      </span>{' '}
      人看爆
    </span>
  )
}
