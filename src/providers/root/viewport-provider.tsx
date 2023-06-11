'use client'

import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'

import { viewportAtom } from '~/atoms/viewport'
import { debounce } from '~/lib/_'
import { jotaiStore } from '~/lib/store'

export const ViewportProvider: Component = ({ children }) => {
  useIsomorphicLayoutEffect(() => {
    const readViewport = debounce(
      () => {
        const { innerWidth: w, innerHeight: h } = window
        const sm = w >= 640
        const md = w >= 768
        const lg = w >= 1024
        const xl = w >= 1280
        const _2xl = w >= 1536
        jotaiStore.set(viewportAtom, {
          sm,
          md,
          lg,
          xl,
          '2xl': _2xl,
          h,
          w,
        })
      },
      16,
      true,
    )

    readViewport()

    window.addEventListener('resize', readViewport)
    return () => {
      window.removeEventListener('resize', readViewport)
    }
  }, [])

  return <>{children}</>
}
