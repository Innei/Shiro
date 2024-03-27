import { setGlobalStore } from 'jojoo'
import { createStore } from 'jotai'

const store = createStore()
setGlobalStore(store)
export const jotaiStore = store
