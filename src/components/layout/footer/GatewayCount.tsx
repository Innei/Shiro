'use client'

import { useOnlineCount } from '~/atoms'
import { FloatPopover } from '~/components/ui/float-popover'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'

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
      </div>
    </FloatPopover>
  )
}
const GatewayCountTrigger = () => {
  const count = useOnlineCount()
  return (
    <span>
      正在被 <NumberSmoothTransition>{count}</NumberSmoothTransition> 人看爆
    </span>
  )
}
