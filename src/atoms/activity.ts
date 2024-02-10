import { produce } from 'immer'
import { atom } from 'jotai'
import type { ActivityPresence } from '~/models/activity'

import { jotaiStore } from '~/lib/store'

type Activity = {
  process: {
    name: string
    iconBase64?: string
    iconUrl?: string
    description?: string
  } | null
  media: {
    title: string
    artist: string
  } | null
}

export const activityAtom = atom({
  process: null,
  media: null,
} as Activity)

export const setActivityProcessInfo = (process: Activity['process'] | null) =>
  jotaiStore.set(activityAtom, (prev) => ({ ...prev, process }))

export const setActivityMediaInfo = (media: Activity['media']) =>
  jotaiStore.set(activityAtom, (prev) => ({ ...prev, media }))

/////////

export const activityPresenceAtom = atom({} as Record<string, ActivityPresence>)

export const setActivityPresence = (presence: ActivityPresence) => {
  jotaiStore.set(activityPresenceAtom, (prev) => ({
    ...prev,
    [presence.identity]: presence,
  }))
}

export const deleteActivityPresence = (sessionId: string) => {
  jotaiStore.set(activityPresenceAtom, (prev) => {
    return produce(prev, (draft) => {
      delete draft[sessionId]
    })
  })
}

export const resetActivityPresence = (
  data?: Record<string, ActivityPresence>,
) => jotaiStore.set(activityPresenceAtom, data || {})
