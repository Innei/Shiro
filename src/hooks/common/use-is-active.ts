import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  const handler = function () {
    listeners.forEach((listener) => listener())
  }
  document.addEventListener('visibilitychange', handler)

  return () => {
    document.removeEventListener('visibilitychange', handler)
    listeners.delete(listener)
  }
}

export const usePageIsActive = () => {
  return useSyncExternalStore(
    subscribe,
    () => document.visibilityState === 'visible',

    () => true,
  )
}
