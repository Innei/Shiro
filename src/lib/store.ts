import { getGlobalStore } from 'jojoo'
import type { getDefaultStore } from 'jotai'
import type { INTERNAL_PrdStore } from 'jotai/vanilla/store'

export const jotaiStore: INTERNAL_PrdStore = getGlobalStore()
