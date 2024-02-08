import { createAtomHooks } from 'jojoo/react'
import { useMemo } from 'react'
import { atom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { useUser } from '@clerk/nextjs'
import { nanoid } from '@milkdown/utils'

import { buildNSKey } from '~/lib/ns'
import { jotaiStore } from '~/lib/store'

import { useIsLogged, useOwner } from './owner'

export const socketWebDefaultSessionIdAtom = atomWithStorage(
  buildNSKey('web-session'),
  nanoid(),
)

export const getSocketWebSessionId = () =>
  jotaiStore.get(socketWebDefaultSessionIdAtom)

export const [, , useOnlineCount, , , setOnlineCount] = createAtomHooks(atom(0))

const socketIsConnectAtom = atom(false)
export const useSocketIsConnect = () => {
  return useAtomValue(socketIsConnectAtom)
}

export const setSocketIsConnect = (value: boolean) => {
  jotaiStore.set(socketIsConnectAtom, value)
}

export const useSocketSessionId = () => {
  const user = useUser()
  const owner = useOwner()
  const ownerIsLogin = useIsLogged()

  const fallbackSid = useAtomValue(socketWebDefaultSessionIdAtom)
  return useMemo((): string => {
    if (ownerIsLogin) {
      if (!owner) return fallbackSid
      return `owner-${owner.id}`
    } else if (user && user.isSignedIn) {
      return `user-${user.user.id}`
    }
    return fallbackSid
  }, [fallbackSid, owner, ownerIsLogin, user])
}
