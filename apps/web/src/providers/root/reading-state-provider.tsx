'use client'

import { useEffect, useRef } from 'react'

import { setIsFocusReading, setIsInReading } from '~/atoms/hooks/reading'
import { usePathname } from '~/i18n/navigation'

export const ReadingStateResetProvider = () => {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsInReading(false)
      setIsFocusReading(false)
      prevPathname.current = pathname
    }
  }, [pathname])

  return null
}
