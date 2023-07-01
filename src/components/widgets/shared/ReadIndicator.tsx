'use client'

import type { ElementType } from 'react'

import { useReadPercent } from '~/hooks/shared/use-read-percent'
import { clsxm } from '~/lib/helper'

export const ReadIndicator: Component<{
  as?: ElementType
}> = ({ className, as }) => {
  const readPercent = useReadPercent()
  const As = as || 'span'
  return (
    <As className={clsxm('text-gray-800 dark:text-neutral-300', className)}>
      {readPercent}%
    </As>
  )
}
