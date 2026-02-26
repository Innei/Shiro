import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { TrackerAction } from '~/constants/tracker'

export interface EventHandlerContext {
  router: AppRouterInstance
}

export type EventHandler = (data: any, ctx: EventHandlerContext) => void

export const trackerRealtimeEvent = (label = 'Socket Realtime Event') => {
  document.dispatchEvent(
    new CustomEvent('impression', {
      detail: {
        action: TrackerAction.Impression,
        label,
      },
    }),
  )
}

export const updateMessage = '由于作者更新了此文章/内容，所以页面内容自动刷新了'
