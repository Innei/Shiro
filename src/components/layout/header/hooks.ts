'use client'

import { useEffect } from 'react'

import {
  useSetHeaderMetaInfo,
  useSetHeaderShouldShowBg,
} from '~/components/layout/header/internal/hooks'

export const useHideHeaderBgInRoute = () => {
  const setter = useSetHeaderShouldShowBg()
  useEffect(() => {
    setter(false)
    return () => {
      setter(true)
    }
  }, [])
}

export const HeaderHideBg = () => {
  useHideHeaderBgInRoute()
  return null
}

export { useSetHeaderMetaInfo }
