'use client'

import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { ExtractAtomValue } from 'jotai/vanilla'

import { viewportAtom } from '~/atoms/viewport'
import { useIsClient } from '~/hooks/common/use-is-client'

const selector = (v: ExtractAtomValue<typeof viewportAtom>) => v.lg
export const OnlyLg: Component = ({ children }) => {
  const isClient = useIsClient()

  const isLg = useAtomValue(selectAtom(viewportAtom, selector))
  if (!isClient) return null

  if (!isLg) return null

  return <>{children}</>
}
