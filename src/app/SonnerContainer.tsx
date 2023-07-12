'use client'

import { Toaster } from 'sonner'

import { useIsDark } from '~/hooks/common/use-is-dark'

export const SonnerContainer = () => {
  const isDark = useIsDark()
  return (
    <Toaster
      richColors
      closeButton
      duration={6666}
      theme={isDark ? 'dark' : 'light'}
    />
  )
}
