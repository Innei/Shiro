import { getGlobalStore } from 'jojoo'
import type { INTERNAL_PrdStore } from 'jotai/vanilla/store'

export const jotaiStore: INTERNAL_PrdStore = getGlobalStore()
