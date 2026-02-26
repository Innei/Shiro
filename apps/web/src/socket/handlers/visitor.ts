import { setOnlineCount } from '~/atoms'
import { EventTypes } from '~/types/events'

import type { EventHandler } from './types'

export const visitorHandler: EventHandler = (data) => {
  const { online } = data
  setOnlineCount(online)
}

export const visitorEvents = [
  EventTypes.VISITOR_ONLINE,
  EventTypes.VISITOR_OFFLINE,
] as const
