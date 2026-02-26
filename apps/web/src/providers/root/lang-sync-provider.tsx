'use client'

import { useLocale } from 'next-intl'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { attachFetchHeader } from '~/lib/request'

export const LangSyncProvider = ({ children }: PropsWithChildren) => {
  const locale = useLocale()

  useEffect(() => {
    const cleanup = attachFetchHeader('x-lang', locale)
    return cleanup
  }, [locale])

  return children
}
