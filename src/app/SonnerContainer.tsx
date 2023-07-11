'use client'

import { Toaster } from 'sonner'

export const SonnerContainer = () => {
  // FIXME https://github.com/emilkowalski/sonner/issues/100
  // const isDark = useIsDark()
  return (
    <Toaster
      richColors
      closeButton
      duration={6666}
      // theme={isDark ? 'dark' : 'light'}
      theme="system"
    />
  )
}
