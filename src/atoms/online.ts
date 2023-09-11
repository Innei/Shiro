import { createAtomHooks } from 'jojoo/react'
import { setStore } from 'jojoo'
import { atom } from 'jotai'

import { jotaiStore } from '~/lib/store'

setStore(jotaiStore)
export const [, , useOnlineCount, , , setOnlineCount] = createAtomHooks(atom(0))
