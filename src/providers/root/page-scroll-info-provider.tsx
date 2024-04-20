'use client'

import { useMemo, useRef } from 'react'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { setIsInteractive } from '~/atoms/is-interactive'
import { createAtomSelector } from '~/lib/atom'
import { throttle } from '~/lib/lodash'

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
  const setIsInteractiveOnceRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const scrollHandler = throttle(
      () => {
        if (!setIsInteractiveOnceRef.current) {
          setIsInteractive(true)
          setIsInteractiveOnceRef.current = true
        }
        let currentTop = document.documentElement.scrollTop

        // 当 radix modal 被唤出，body 会被设置为 fixed，此时需要获取 body 的 top 值。
        // 只有在 mobile 端会出现这种逻辑
        if (currentTop === 0) {
          const bodyStyle = document.body.style
          if (bodyStyle.position === 'fixed') {
            const bodyTop = bodyStyle.top
            currentTop = Math.abs(parseInt(bodyTop, 10))
          }
        }
        setPageScrollDirection(
          prevScrollY.current - currentTop > 0 ? 'up' : 'down',
        )
        prevScrollY.current = currentTop

        setPageScrollLocation(prevScrollY.current)
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

const usePageScrollLocationSelector = createAtomSelector(pageScrollLocationAtom)
const usePageScrollDirectionSelector = createAtomSelector(
  pageScrollDirectionAtom,
)

const useIsScrollUpAndPageIsOver = (threshold: number) => {
  return useAtomValue(
    useMemo(
      () =>
        atom((get) => {
          const scrollLocation = get(pageScrollLocationAtom)
          const scrollDirection = get(pageScrollDirectionAtom)
          return scrollLocation > threshold && scrollDirection === 'up'
        }),
      [threshold],
    ),
  )
}
export {
  usePageScrollDirection,
  usePageScrollLocation,
  useIsScrollUpAndPageIsOver,
  usePageScrollLocationSelector,
  usePageScrollDirectionSelector,
}
