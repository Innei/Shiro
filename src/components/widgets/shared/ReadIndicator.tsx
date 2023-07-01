'use client'

import type { ElementType } from 'react'

import { clsxm } from '~/lib/helper'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'
import {
  useWrappedElementPositsion,
  useWrappedElementSize,
} from '~/providers/shared/WrappedElementProvider'

export const ReadIndicator: Component<{
  as?: ElementType
}> = ({ className, as }) => {
  const { y } = useWrappedElementPositsion()
  const { h } = useWrappedElementSize()
  const readPercent = usePageScrollLocationSelector(
    (scrollTop) => {
      return (
        Math.floor(Math.min(Math.max(0, ((scrollTop - y) / h) * 100), 100)) || 0
      )
    },
    [y, h],
  )
  const As = as || 'span'
  return h > 0 ? (
    <As className={clsxm('text-gray-800 dark:text-neutral-300', className)}>
      {readPercent}%
    </As>
  ) : null
}
