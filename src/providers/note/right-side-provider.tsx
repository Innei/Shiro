'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import { useIsClient } from '~/hooks/common/use-is-client'

const rightSideElementAtom = atom<null | HTMLDivElement>(null)
export const NoteLayoutRightSideProvider: Component = ({ className }) => {
  const setElement = useSetAtom(rightSideElementAtom)

  useEffect(() => {
    return () => {
      // GC
      setElement(null)
    }
  }, [])

  return <div ref={setElement} className={className} />
}

export const NoteLayoutRightSidePortal: Component = ({ children }) => {
  const rightSideElement = useAtomValue(rightSideElementAtom)

  const isClient = useIsClient()
  if (!isClient) return null

  if (!rightSideElement) return null

  return createPortal(children, rightSideElement)
}
