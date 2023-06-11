'use client'

import React, { useEffect } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { FC } from 'react'

const rightSideAtom = atom<FC | JSX.Element | null>(null)

const useSetNoteLayoutRightSideElement = () => useSetAtom(rightSideAtom)

export const NoteLayoutRightSideProvider = () => {
  const ReactNodeOrComponent = useAtomValue(rightSideAtom)

  if (!ReactNodeOrComponent) return null

  if (React.isValidElement(ReactNodeOrComponent)) return ReactNodeOrComponent
  else if (typeof ReactNodeOrComponent === 'function')
    return <ReactNodeOrComponent />
  else return null
}

export const NoteLayoutRightSidePortal: Component = ({ children }) => {
  const setter = useSetNoteLayoutRightSideElement()

  useEffect(() => {
    setter(<>{children}</>)
  }, [children])

  return null
}
