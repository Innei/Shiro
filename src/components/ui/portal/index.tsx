'use client'

import { createPortal } from 'react-dom'
import type { FC, PropsWithChildren } from 'react'

import { useIsClient } from '~/hooks/common/use-is-client'

import { useRootPortal } from './provider'

export const RootPortal: FC<
  {
    to?: HTMLElement
  } & PropsWithChildren
> = (props) => {
  const isClient = useIsClient()
  const to = useRootPortal()
  if (!isClient) {
    return null
  }

  return createPortal(props.children, props.to || to || document.body)
}
