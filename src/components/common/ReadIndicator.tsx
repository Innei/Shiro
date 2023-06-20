/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import type { ElementType } from 'react'

import {
  useArticleElementPositsion,
  useArticleElementSize,
} from '~/providers/article/article-element-provider'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'
import { clsxm } from '~/utils/helper'

export const ReadIndicator: Component<{
  as?: ElementType
}> = ({ className, as }) => {
  const { y } = useArticleElementPositsion()
  const { h } = useArticleElementSize()
  const readPercent = usePageScrollLocationSelector((scrollTop) => {
    return Math.floor(Math.min(Math.max(0, ((scrollTop - y) / h) * 100), 100))
  })
  const As = as || 'span'
  return (
    <As className={clsxm('text-gray-800 dark:text-neutral-300', className)}>
      {readPercent}%
    </As>
  )
}
