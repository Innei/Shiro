'use client'

import { useDeferredValue } from 'react'

import { usePageScrollLocation } from '~/providers/root/page-scroll-info-provider'
import { clsxm } from '~/utils/helper'

export const useHeaderOpacity = () => {
  const threshold = 50
  const y = usePageScrollLocation()
  const headerOpacity = useDeferredValue(
    y >= threshold ? 1 : Math.floor((y / threshold) * 100) / 100,
  )

  return headerOpacity
}

export const BluredBackground = () => {
  const headerOpacity = useHeaderOpacity()
  return (
    <div
      className={clsxm(
        'absolute inset-0 transform-gpu [backdrop-filter:saturate(180%)_blur(20px)] [backface-visibility:hidden]',
        'bg-themed-bg_opacity [border-bottom:1px_solid_rgb(187_187_187_/_20%)]',
      )}
      style={{
        opacity: headerOpacity,
      }}
    />
  )
}
