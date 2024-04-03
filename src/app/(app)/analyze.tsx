'use client'

import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import type { TrackerAction } from '~/constants/tracker'

import { isClientSide } from '~/lib/env'

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: any) => void
    }
  }
}
const loadOpenPanelSdk = () =>
  import('@openpanel/nextjs').then(({ trackEvent }) => ({
    trackEvent,
  }))
if (isClientSide) {
  ;(window as any).loadOpenPanelSdk = loadOpenPanelSdk
}
export const Analyze = () => {
  const onceRef = useRef(false)
  useServerInsertedHTML(() => {
    if (onceRef.current) {
      return
    }

    onceRef.current = true
    // const apiBase = apiClient.proxy.fn.utils.analyze.toString(true)

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `(${function () {
            document.addEventListener(
              'click',
              async (e) => {
                const $ = e.target as HTMLElement

                let current: HTMLElement | null = $
                let event = $.dataset.event
                while (!event && current && current !== document.body) {
                  event = current.dataset.event
                  current = current.parentElement
                }

                if (event) {
                  console.info('dom track click event', event)
                  window.umami?.track(event, {
                    type: 'click',
                  })
                  loadOpenPanelSdk().then(({ trackEvent }) => {
                    trackEvent(event, {
                      type: 'click',
                    })
                  })
                }
              },
              true,
            )

            document.addEventListener('impression', async (e: any) => {
              const detail = e.detail as {
                action: TrackerAction
                label: string
              }

              console.info(detail, 'detail')
              window.umami?.track(detail.label, {
                type: 'impression',
              })

              loadOpenPanelSdk().then(({ trackEvent }) => {
                trackEvent(detail.label, {
                  type: 'impression',
                })
              })
            })
          }.toString()})();`,
        }}
      />
    )
  })

  return null
}
