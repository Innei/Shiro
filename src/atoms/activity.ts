import { atom, useAtomValue } from 'jotai'

import { jotaiStore } from '~/lib/store'

type Activity = {
  processName: string
  media: {
    title: string
    artist: string
  } | null
}

const activityAtom = atom({
  processName: '',
  media: null,
} as Activity)

export const useActivity = () => useAtomValue(activityAtom)
export const setActivityProcessName = (processName: string) =>
  jotaiStore.set(activityAtom, (prev) => ({ ...prev, processName }))

export const setActivityMediaInfo = (media: Activity['media']) =>
  jotaiStore.set(activityAtom, (prev) => ({ ...prev, media }))
