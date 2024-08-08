import { useAtomValue } from 'jotai'
import type { OwnerStatus } from '../status'

import { jotaiStore } from '~/lib/store'

import { statusAtom } from '../status'

export const useOwnerStatus = () => useAtomValue(statusAtom)

export const setOwnerStatus = (status: null | OwnerStatus) =>
  jotaiStore.set(statusAtom, status)
