import { atom, useAtomValue } from 'jotai'

import { jotaiStore } from '~/lib/store'
import { aggregationDataAtom } from '~/providers/root/aggregation-data-provider'

const isOwnerLoggedAtom = atom(false)
export const useOwner = () => useAtomValue(ownerAtom)

export const ownerAtom = atom((get) => get(aggregationDataAtom)?.user)

export const useIsOwnerLogged = () => useAtomValue(isOwnerLoggedAtom)

export const setIsOwnerLogged = (isOwnerLogged: boolean) => {
  jotaiStore.set(isOwnerLoggedAtom, isOwnerLogged)
}

export const isOwnerLogged = () => jotaiStore.get(isOwnerLoggedAtom)
