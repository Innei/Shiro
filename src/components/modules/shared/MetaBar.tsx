import { useCurrentRoomCount } from '~/atoms/hooks'
import { FloatPopover } from '~/components/ui/float-popover'

import { useRoomContext } from '../activity'

export const CurrentReadingCountingMetaBarItem = () => {
  const { roomName } = useRoomContext()
  const count = useCurrentRoomCount(roomName || '')

  if (!roomName || !count) return null

  return (
    <FloatPopover
      asChild
      type="tooltip"
      triggerElement={
        <span>
          当前<span className="mx-1 font-medium">{count}</span>人正在阅读
        </span>
      }
    >
      当前的实时阅读人数，可以通过左侧时间线查看其他人的阅读进度（手机上无法查看）
    </FloatPopover>
  )
}
