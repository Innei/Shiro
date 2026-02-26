import type { AuthUser } from '@mx-space/api-client'
import { createAtomHooks } from 'jojoo/react'
import { atom } from 'jotai'

import { createAtomSelector } from '~/lib/atom'
import type { SessionReader } from '~/models/session'

export const [, , useSessionReader, , getSessionReader, setSessionReader] =
  createAtomHooks(atom<SessionReader | null>(null))

const [authReaderAtom, , , , getAuthReaders, _setAuthReaders] = createAtomHooks(
  atom<Record<string, AuthUser>>({}),
)
export { getAuthReaders }

export const setAuthReaders = (readers: Record<string, AuthUser>) => {
  _setAuthReaders({
    ...getAuthReaders(),
    ...readers,
  })
}
const useAuthReaderSelector = createAtomSelector(authReaderAtom)
export const useAuthReader = (id: string): AuthUser | undefined => {
  return useAuthReaderSelector((readers) => readers[id], [id])
}
