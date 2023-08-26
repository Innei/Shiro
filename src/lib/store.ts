import { setStore } from 'jojoo'
import { createStore } from 'jotai/vanilla'

const jotaiStore = createStore()
setStore(jotaiStore)

export { jotaiStore }
