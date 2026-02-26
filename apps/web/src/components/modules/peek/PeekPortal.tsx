import { useLayoutEffect } from 'react'

import { usePeek } from './usePeek'

declare global {
  interface Window {
    peek: ReturnType<typeof usePeek>
  }
}

export const PeekPortal = () => {
  const peek = usePeek()

  useLayoutEffect(() => {
    peek && (window.peek = peek)
  }, [peek])
  return null
}
