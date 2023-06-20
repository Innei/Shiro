import { atom, useAtomValue } from 'jotai'

import { jotaiStore } from '~/lib/store'

const cssPrintMediaAtom = atom(false)

export const useIsPrintMode = () => useAtomValue(cssPrintMediaAtom)

export const setIsPrintMode = (status: boolean) =>
  jotaiStore.set(cssPrintMediaAtom, status)
