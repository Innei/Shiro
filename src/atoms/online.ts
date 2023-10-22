import { createAtomHooks } from 'jojoo/react'
import { setGlobalStore } from 'jojoo'
import { atom } from 'jotai'

import { jotaiStore } from '~/lib/store'

setGlobalStore(jotaiStore)
export const [, , useOnlineCount, , , setOnlineCount] = createAtomHooks(atom(0))
