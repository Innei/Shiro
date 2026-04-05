'use client'

import { useLocale } from 'next-intl'
import { useEffect } from 'react'

import { setDayjsLocale } from '~/app/init'

export const DayjsLocaleSync = () => {
  const locale = useLocale()

  useEffect(() => {
    setDayjsLocale(locale)
  }, [locale])

  return null
}
