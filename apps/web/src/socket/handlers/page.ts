import { toast } from '~/lib/toast'
import {
  getCurrentPageData,
  setCurrentPageData,
} from '~/providers/page/CurrentPageDataProvider'
import { EventTypes } from '~/types/events'

import type { EventHandler } from './types'
import { trackerRealtimeEvent, updateMessage } from './types'

export const pageUpdateHandler: EventHandler = (data) => {
  const { slug } = data
  if (getCurrentPageData()?.slug === slug) {
    setCurrentPageData((draft) => {
      Object.assign(draft, data)
    })
    toast.info(updateMessage)
    trackerRealtimeEvent()
  }
}

export const pageHandlers = {
  [EventTypes.PAGE_UPDATE]: pageUpdateHandler,
  [EventTypes.PAGE_UPDATED]: pageUpdateHandler,
} as const
