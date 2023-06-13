import { atom, useAtomValue } from 'jotai'

import { jotaiStore } from '~/lib/store'

const onlineCountAtom = atom(0)

export const setOnlineCount = (count: number) => {
  jotaiStore.set(onlineCountAtom, count)
}

export const useOnlineCount = () => {
  return useAtomValue(onlineCountAtom)
}
