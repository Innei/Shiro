import { useAtomValue } from 'jotai'
import { customAlphabet } from 'nanoid'
import { useMemo } from 'react'

import { isClientSide } from '~/lib/env'
import { buildNSKey } from '~/lib/ns'

import { socketIsConnectAtom } from '../socket'
import { useIsLogged, useOwner } from './owner'
import { useSessionReader } from './reader'

const alphabet = `1234567890abcdefghijklmnopqrstuvwxyz`

const nanoid = customAlphabet(alphabet)
const defaultSessionId = nanoid(8)
const storageKey = buildNSKey('web-session')

export const getSocketWebSessionId = () => {
  if (!isClientSide) {
    return ''
  }
  const sessionId = localStorage.getItem(storageKey)
  if (sessionId) return sessionId
  localStorage.setItem(storageKey, defaultSessionId)
  return defaultSessionId
}

export const useSocketSessionId = () => {
  const sessionReader = useSessionReader()
  const owner = useOwner()
  const ownerIsLogin = useIsLogged()

  return useMemo((): string => {
    const fallbackSid = getSocketWebSessionId()
    if (ownerIsLogin) {
      if (!owner) return fallbackSid
      return `owner_${owner.id}`
    } else if (sessionReader) {
      return sessionReader.id.toLowerCase()
    }
    return fallbackSid
  }, [owner, ownerIsLogin, sessionReader])
}

export const useSocketIsConnect = () => useAtomValue(socketIsConnectAtom)
