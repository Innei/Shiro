'use client'

import { useOpenPanel } from '@openpanel/nextjs'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { useRef } from 'react'

import PKG from '~/../package.json'
import type { TrackerAction } from '~/constants/tracker'

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: any) => void
    }
  }
}
export const Analyze = () => {
  const onceRef = useRef(false)
  const { track, setGlobalProperties } = useOpenPanel()
  // eslint-disable-next-line react-compiler/react-compiler
  useIsomorphicLayoutEffect(() => {
    if (onceRef.current) {
      return
    }

    setGlobalProperties({
      version: PKG.version,
      commit: process.env.COMMIT_HASH,
      app: 'shiroi',
    })

    onceRef.current = true

    const handler1 = async (e: MouseEvent) => {
      const $ = e.target as HTMLElement

      let current: HTMLElement | null = $
      let { event } = $.dataset
      while (!event && current && current !== document.body) {
        event = current.dataset.event
        current = current.parentElement
      }

      if (event) {
        console.info('dom track click event', event)
        window.umami?.track(event, {
          type: 'click',
        })

        track(event, {
          type: 'click',
        })
      }
    }
    document.addEventListener('click', handler1, true)

    const handler2 = async (e: any) => {
      const detail = e.detail as {
        action: TrackerAction
        label: string
      }

      console.info(detail, 'detail')
      window.umami?.track(detail.label, {
        type: 'impression',
      })

      track(detail.label, {
        type: 'impression',
      })
    }
    document.addEventListener('impression', handler2)

    return () => {
      document.removeEventListener('click', handler1, true)
      document.removeEventListener('impression', handler2)
    }
  }, [])

  return null
}
