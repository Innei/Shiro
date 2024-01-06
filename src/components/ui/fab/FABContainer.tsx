'use client'

import React, { useEffect, useId, useRef } from 'react'
import clsx from 'clsx'
import { typescriptHappyForwardRef } from 'foxact/typescript-happy-forward-ref'
import { AnimatePresence, m } from 'framer-motion'
import { atom, useAtomValue } from 'jotai'
import type { HTMLMotionProps } from 'framer-motion'
import type { PropsWithChildren, ReactNode } from 'react'

import { useIsMobile } from '~/atoms'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'
import { usePageScrollDirectionSelector } from '~/providers/root/page-scroll-info-provider'

import { RootPortal } from '../portal'

const fabContainerElementAtom = atom(null as HTMLDivElement | null)

export interface FABConfig {
  id: string
  icon: JSX.Element
  onClick: () => void
}

export const FABBase = typescriptHappyForwardRef(
  (
    props: PropsWithChildren<
      {
        id: string
        show?: boolean
        children: JSX.Element
      } & HTMLMotionProps<'button'>
    >,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const { children, show = true, ...extra } = props
    const { className, ...rest } = extra

    return (
      <AnimatePresence mode="wait">
        {show && (
          <m.button
            ref={ref}
            aria-label="Floating action button"
            initial={{ opacity: 0.3, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.3, scale: 0.8 }}
            className={clsxm(
              'mt-2 flex items-center justify-center',
              'h-12 w-12 text-lg md:h-10 md:w-10 md:text-base',
              'border border-accent outline-accent hover:opacity-100 focus:opacity-100 focus:outline-none',
              'rounded-xl border border-zinc-400/20 shadow-lg backdrop-blur-lg dark:border-zinc-500/30 dark:bg-zinc-800/80 dark:text-zinc-200',
              'bg-slate-50/80 shadow-lg dark:bg-neutral-900/80',
              'transition-all duration-500 ease-in-out',

              className,
            )}
            {...rest}
          >
            {children}
          </m.button>
        )}
      </AnimatePresence>
    )
  },
)

export const FABPortable = typescriptHappyForwardRef(
  (
    props: {
      children: React.JSX.Element

      onClick: () => void
      onlyShowInMobile?: boolean
    },
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const { onClick, children } = props
    const id = useId()
    const portalElement = useAtomValue(fabContainerElementAtom)
    const isMobile = useIsMobile()
    if (props.onlyShowInMobile && !isMobile) return null
    if (!portalElement) return null

    return (
      <RootPortal to={portalElement}>
        <FABBase ref={ref} id={id} onClick={onClick}>
          {children}
        </FABBase>
      </RootPortal>
    )
  },
)

export const FABContainer = (props: { children?: ReactNode }) => {
  const isMobile = useIsMobile()

  const shouldHide = usePageScrollDirectionSelector(
    (direction) => {
      return isMobile && direction === 'down'
    },
    [isMobile],
  )

  const fabContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    jotaiStore.set(fabContainerElementAtom, fabContainerRef.current)
  }, [])

  return (
    <div
      ref={fabContainerRef}
      data-testid="fab-container"
      data-hide-print
      className={clsx(
        'font-lg fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] left-[calc(100vw-3rem-1rem)] z-[9] flex flex-col',
        shouldHide ? 'translate-x-[calc(100%+2rem)]' : '',
        'transition-transform duration-300 ease-in-out',
      )}
    >
      {props.children}
    </div>
  )
}
