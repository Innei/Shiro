import type { FC } from 'react'

import { useCurrentRoomCount } from '~/atoms/hooks'
import { FloatPopover } from '~/components/ui/float-popover'

import { useMaybeInRoomContext } from '../activity'

export const CurrentReadingCountingMetaBarItem: FC<{
  leftElement?: React.ReactNode
}> = ({ leftElement }) => {
  const roomCtx = useMaybeInRoomContext()

  const count = useCurrentRoomCount(roomCtx?.roomName || '')

  if (!roomCtx || count <= 1) return null

  return (
    <>
      {leftElement}
      <FloatPopover
        asChild
        mobileAsSheet
        type="tooltip"
        triggerElement={
          <span>
            当前<span className="mx-1 font-medium">{count}</span>人正在阅读
          </span>
        }
      >
        当前的实时阅读人数，可以通过左侧时间线查看其他人的阅读进度（手机上无法查看）
      </FloatPopover>
    </>
  )
}
