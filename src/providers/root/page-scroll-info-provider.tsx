'use client'

import { useEffect, useRef } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

const pageScrollLocationAtom = atom(0)
const pageScrollDirectionAtom = atom<'up' | 'down' | null>(null)

export const PageScrollInfoProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ScrollDetector />
      {children}
    </>
  )
}

const ScrollDetector = () => {
  const setPageScrollLocation = useSetAtom(pageScrollLocationAtom)
  const setPageScrollDirection = useSetAtom(pageScrollDirectionAtom)
  const prevScrollY = useRef(0)
  useEffect(() => {
    window.addEventListener('scroll', () => {
      const currentTop = document.documentElement.scrollTop

      setPageScrollDirection(
        prevScrollY.current - currentTop > 0 ? 'up' : 'down',
      )
      prevScrollY.current = currentTop

      setPageScrollLocation(prevScrollY.current)
    })
  }, [])

  return null
}

const usePageScrollLocation = () => useAtomValue(pageScrollLocationAtom)
const usePageScrollDirection = () => useAtomValue(pageScrollDirectionAtom)
export { usePageScrollDirection, usePageScrollLocation }
