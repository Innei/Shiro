import type { FC } from 'react'

export const Comments: FC<{
  refId: string
}> = ({ refId }) => {
  return (
    <div className="relative mb-[60px] mt-[120px] min-h-[100px]">
      Comments WIP, RefId: {refId}
    </div>
  )
}
