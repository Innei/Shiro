import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { ExtractAtomValue } from 'jotai'

import { viewportAtom } from '../viewport'

export const useViewport = <T>(
  selector: (value: ExtractAtomValue<typeof viewportAtom>) => T,
): T =>
  useAtomValue(
    selectAtom(
      viewportAtom,
      useCallback((atomValue) => selector(atomValue), []),
    ),
  )

export const useIsMobile = () =>
  useViewport(
    useCallback(
      (v: ExtractAtomValue<typeof viewportAtom>) =>
        (v.sm || v.md || !v.sm) && !v.lg,
      [],
    ),
  )
