import type { ExtractAtomValue } from 'jotai'
import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { useCallback } from 'react'

import { jotaiStore } from '~/lib/store'

import { viewportAtom } from '../viewport'

export const useViewport = <T>(
  selector: (value: ExtractAtomValue<typeof viewportAtom>) => T,
): T =>
  useAtomValue(
    selectAtom(
      viewportAtom,
      useCallback((atomValue) => selector(atomValue), []),
    ),
    { store: jotaiStore },
  )

export const useIsMobile = () =>
  useViewport(
    useCallback((v: ExtractAtomValue<typeof viewportAtom>) => isMobile(v), []),
  )

const isMobile = (v: ExtractAtomValue<typeof viewportAtom>) =>
  v.w !== 0 && v.w <= 1024
export const currentIsMobile = () => {
  const v = jotaiStore.get(viewportAtom)
  return isMobile(v)
}

export const getViewport = () => jotaiStore.get(viewportAtom)

export const usePageScrollElement = () => document.documentElement
