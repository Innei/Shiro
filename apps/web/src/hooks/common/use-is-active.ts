import { useSyncExternalStore } from 'react'

const subscribe = (cb: () => void) => {
  document.addEventListener('visibilitychange', cb)
  return () => {
    document.removeEventListener('visibilitychange', cb)
  }
}

const getSnapshot = () => document.visibilityState === 'visible'
const getServerSnapshot = () => true
export const usePageIsActive = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
