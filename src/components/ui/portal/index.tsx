'use client'

import { useAtomValue } from 'jotai'
import type { FC, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import { pageScrollElementAtom } from '~/atoms'
import { useIsClient } from '~/hooks/common/use-is-client'

import { useRootPortal } from './provider'

export const RootPortal: FC<
  {
    to?: HTMLElement
    usePageScrollElement?: boolean
  } & PropsWithChildren
> = (props) => {
  const isClient = useIsClient()
  const to = useRootPortal()
  const pageScrollElement = useAtomValue(pageScrollElementAtom)

  const tableElement = useMemo(
    () => pageScrollElement?.querySelector('#root > main'),
    [pageScrollElement],
  )
  if (!isClient) {
    return null
  }

  return createPortal(
    props.children,
    props.to ||
      (props.usePageScrollElement ? tableElement : to) ||
      document.body,
  )
}
