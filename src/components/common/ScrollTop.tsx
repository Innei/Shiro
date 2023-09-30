'use client'

import { memo, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { isDev } from '~/lib/env'
import { springScrollToTop } from '~/lib/scroller'

export const ScrollTop = memo(() => {
  const pathname = usePathname()
  useEffect(() => {
    if (isDev) return
    springScrollToTop()
  }, [pathname])
  return null
})

ScrollTop.displayName = 'ScrollTop'
