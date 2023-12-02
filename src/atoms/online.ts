import { createAtomHooks } from 'jojoo/react'
import { atom } from 'jotai'

export const [, , useOnlineCount, , , setOnlineCount] = createAtomHooks(atom(0))
