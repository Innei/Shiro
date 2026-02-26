import { useAtomValue } from 'jotai'

import { jotaiStore } from '~/lib/store'

import type { OwnerStatus } from '../status'
import { statusAtom } from '../status'

export const useOwnerStatus = () => useAtomValue(statusAtom)

export const setOwnerStatus = (status: null | OwnerStatus) =>
  jotaiStore.set(statusAtom, status)
