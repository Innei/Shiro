'use client'

import { useEffect, useRef } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import { jotaiStore } from '~/lib/store'

const noteMainContainerHeightAtom = atom(0)
export const NoteMainContainer: Component = ({ className, children }) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const setHeight = useSetAtom(noteMainContainerHeightAtom)
  useEffect(() => {
    if (!mainRef.current) return
    // measure the height of the main element
    const mainHeight = mainRef.current.offsetHeight
    if (mainHeight) setHeight(mainHeight)

    const ob = new ResizeObserver((entries) => {
      const mainHeight = (entries[0].target as HTMLElement).offsetHeight
      if (mainHeight) setHeight(mainHeight)
    })
    ob.observe(mainRef.current)

    return () => {
      ob.disconnect()
      jotaiStore.set(noteMainContainerHeightAtom, 0)
    }
  }, [])

  return (
    <main className={className} ref={mainRef}>
      {children}
    </main>
  )
}

export const useNoteMainContainerHeight = () =>
  useAtomValue(noteMainContainerHeightAtom)
