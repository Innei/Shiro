import { atom, useAtomValue } from 'jotai'

import { jotaiStore } from '~/lib/store'

const socketIsConnectAtom = atom(false)
export const useSocketIsConnect = () => {
  return useAtomValue(socketIsConnectAtom)
}

export const setSocketIsConnect = (value: boolean) => {
  jotaiStore.set(socketIsConnectAtom, value)
}
