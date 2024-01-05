'use client'

import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
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
                const event = $.dataset.event

                if (event) {
                  window.umami?.track(event, {
                    type: 'click',
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

              console.log(detail, 'detail')
              window.umami?.track(detail.label, {
                type: 'impression',
              })
            })
          }.toString()})();`,
        }}
      />
    )
  })

  return null
}
