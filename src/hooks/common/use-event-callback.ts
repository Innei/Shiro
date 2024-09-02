'use client'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { useCallback, useRef } from 'react'

export const useEventCallback = <T extends (...args: any[]) => any>(fn: T) => {
  const ref = useRef<T>(fn)
  useIsomorphicLayoutEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback((...args: any[]) => ref.current(...args), []) as T
}
