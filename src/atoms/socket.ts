import { createAtomHooks } from 'jojoo/react'
import { atom } from 'jotai'

import { jotaiStore } from '~/lib/store'

export const [, , useOnlineCount, , , setOnlineCount] = createAtomHooks(atom(0))

export const socketIsConnectAtom = atom(false)

export const setSocketIsConnect = (value: boolean) => {
  jotaiStore.set(socketIsConnectAtom, value)
}
