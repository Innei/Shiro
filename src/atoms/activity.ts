import { atom, useAtomValue } from 'jotai'

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

const activityAtom = atom({
  process: null,
  media: null,
} as Activity)

export const useActivity = () => useAtomValue(activityAtom)
export const setActivityProcessInfo = (process: Activity['process'] | null) =>
  jotaiStore.set(activityAtom, (prev) => ({ ...prev, process }))

export const setActivityMediaInfo = (media: Activity['media']) =>
  jotaiStore.set(activityAtom, (prev) => ({ ...prev, media }))
