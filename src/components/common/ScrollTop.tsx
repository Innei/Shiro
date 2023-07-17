'use client'

import { useEffect } from 'react'

import { springScrollToTop } from '~/lib/scroller'

export const ScrollTop = () => {
  useEffect(() => {
    springScrollToTop()
  }, [])
  return null
}
