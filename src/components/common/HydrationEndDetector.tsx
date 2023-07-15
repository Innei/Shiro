'use client'

import { useEffect } from 'react'
import { atom } from 'jotai'

import { jotaiStore } from '~/lib/store'

const hydrateEndAtom = atom(false)

/**
 * To skip page transition when first load, improve LCP
 */
export const HydrationEndDetector = () => {
  useEffect(() => {
    // waiting for hydration end and animation end
    setTimeout(() => {
      jotaiStore.set(hydrateEndAtom, true)
    }, 2000)
  }, [])
  return null
}

export const isHydrationEnded = () => jotaiStore.get(hydrateEndAtom)
