'use client'

import React, { useEffect, useId } from 'react'
import clsx from 'clsx'
import { AnimatePresence, m } from 'framer-motion'
import { atom, useAtomValue } from 'jotai'
import type { HTMLMotionProps } from 'framer-motion'
import type { PropsWithChildren } from 'react'

import { useIsMobile } from '~/atoms'
import { useIsClient } from '~/hooks/common/use-is-client'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'
import { usePageScrollDirectionSelector } from '~/providers/root/page-scroll-info-provider'

export interface FABConfig {
  id: string
  icon: JSX.Element
  onClick: () => void
}

export const FABBase = (
  props: PropsWithChildren<
    {
      id: string
      show?: boolean
      children: JSX.Element
    } & HTMLMotionProps<'button'>
  >,
) => {
  const { children, show = true, ...extra } = props
  const { className, ...rest } = extra

  return (
    <AnimatePresence mode="wait">
      {show && (
        <m.button
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
}

const fabConfigAtom = atom([] as FABConfig[])
export const FABPortable = (props: {
  children: React.JSX.Element

  onClick: () => void
}) => {
  const { onClick, children } = props
  const id = useId()
  useEffect(() => {
    jotaiStore.set(fabConfigAtom, (prev) => {
      if (prev.find((config) => config.id === id)) return prev
      return [...prev, { id, onClick, icon: children }]
    })

    return () => {
      jotaiStore.set(fabConfigAtom, (prev) => {
        return prev.filter((config) => config.id !== id)
      })
    }
  }, [children, id, onClick])
  return null
}
export const FABContainer = (props: {
  children: JSX.Element | JSX.Element[]
}) => {
  const fabConfig = useAtomValue(fabConfigAtom)

  const isClient = useIsClient()
  const isMobile = useIsMobile()

  const shouldHide = usePageScrollDirectionSelector(
    (direction) => {
      return isMobile && direction === 'down'
    },
    [isMobile],
  )

  if (!isClient) return null

  return (
    <div
      data-testid="fab-container"
      className={clsx(
        'font-lg fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] right-4 z-[9] flex flex-col',
        shouldHide ? 'translate-x-[calc(100%+2rem)]' : '',
        'transition-transform duration-300 ease-in-out',
      )}
    >
      {fabConfig.map((config) => {
        const { id, onClick, icon } = config
        return (
          <FABBase id={id} onClick={onClick} key={id}>
            {icon}
          </FABBase>
        )
      })}
      {props.children}
    </div>
  )
}
