'use client'

import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

import { apiClient } from '~/lib/request'

export const Analyze = () => {
  const onceRef = useRef(false)
  useServerInsertedHTML(() => {
    if (onceRef.current) {
      return
    }

    onceRef.current = true
    const apiBase = apiClient.proxy.fn.utils.analyze.toString(true)

    return (
      <script
        dangerouslySetInnerHTML={{
          __html:
            `var apiBase = "${apiBase}";
        ${function run() {
          document.addEventListener('click', async (e) => {
            const $ = e.target as HTMLElement
            const event = $.dataset.event

            if (event) {
              await fetch(apiBase, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  key: 'mx',
                  event,
                  type: 'inc',
                }),
              })
            }
          })
        }.toString()}\n` + `run();`,
        }}
      />
    )
  })

  return null
}
