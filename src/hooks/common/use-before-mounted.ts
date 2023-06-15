import { useRef } from 'react'

import { useIsClient } from './use-is-client'

export const useBeforeMounted = (fn: () => any) => {
  const isClient = useIsClient()
  const effectOnce = useRef(false)

  if (isClient && !effectOnce.current) {
    effectOnce.current = true
    fn?.()
  }
}
