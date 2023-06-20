'use client'

import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { ExtractAtomValue } from 'jotai/vanilla'

import { viewportAtom } from '~/atoms/viewport'
import { useIsClient } from '~/hooks/common/use-is-client'

const selector = (v: ExtractAtomValue<typeof viewportAtom>) =>
  (v.sm || v.md || !v.sm) && !v.lg
export const OnlyMobile: Component = ({ children }) => {
  const isClient = useIsClient()

  const isMobile = useAtomValue(selectAtom(viewportAtom, selector))

  if (!isClient) return null

  if (!isMobile) return null

  return children
}
