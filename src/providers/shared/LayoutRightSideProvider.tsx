'use client'

import React, { useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import { useIsClient } from '~/hooks/common/use-is-client'

const rightSideElementAtom = atom<null | HTMLDivElement>(null)
export const LayoutRightSideProvider: Component = ({ className }) => {
  const setElement = useSetAtom(rightSideElementAtom)
  const divRef = React.useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    setElement(divRef.current)
    return () => {
      // GC
      setElement(null)
    }
  }, [])

  return (
    <div
      ref={divRef}
      className={className}
      // data-testid="LayoutRightSideProvider"
    />
  )
}

export const LayoutRightSidePortal: Component = ({ children }) => {
  const rightSideElement = useAtomValue(rightSideElementAtom)

  const isClient = useIsClient()
  if (!isClient) return null

  if (!rightSideElement) return null

  return createPortal(children, rightSideElement)
}
