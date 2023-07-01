'use client'

import { startTransition, useCallback, useRef } from 'react'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { ExtractAtomValue } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { setIsInteractive } from '~/atoms/is-interactive'
import { throttle } from '~/lib/_'

const pageScrollLocationAtom = atom(0)
const pageScrollDirectionAtom = atom<'up' | 'down' | null>(null)
// const pageScrollSpeedAtom = atom(0)

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
  const setIsInteractiveOnceRef = useRef(false)

  // const lastTime = useRef(0)
  // const setScrollSpeed = useSetAtom(pageScrollSpeedAtom)

  useIsomorphicLayoutEffect(() => {
    const scrollHandler = throttle(
      () => {
        if (!setIsInteractiveOnceRef.current) {
          setIsInteractive(true)
          setIsInteractiveOnceRef.current = true
        }
        const currentTop = document.documentElement.scrollTop

        setPageScrollDirection(
          prevScrollY.current - currentTop > 0 ? 'up' : 'down',
        )
        prevScrollY.current = currentTop
        startTransition(() => {
          setPageScrollLocation(prevScrollY.current)
        })
      },
      16,
      {
        leading: false,
      },
    )
    window.addEventListener('scroll', scrollHandler)

    scrollHandler()

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  return null
}

const usePageScrollLocation = () => useAtomValue(pageScrollLocationAtom)
const usePageScrollDirection = () => useAtomValue(pageScrollDirectionAtom)

const usePageScrollLocationSelector = <T,>(
  selector: (scrollY: number) => T,
  deps: any[] = [],
): T =>
  useAtomValue(
    // @ts-ignore
    selectAtom(
      pageScrollLocationAtom,
      useCallback(($) => selector($), deps),
    ),
  )
const usePageScrollDirectionSelector = <T,>(
  selector: (value: ExtractAtomValue<typeof pageScrollDirectionAtom>) => T,
  deps: any[] = [],
) =>
  useAtomValue(
    // @ts-ignore
    selectAtom(
      pageScrollDirectionAtom,
      useCallback(($) => selector($), deps),
    ),
  )
export {
  usePageScrollDirection,
  usePageScrollLocation,
  usePageScrollLocationSelector,
  usePageScrollDirectionSelector,
}
