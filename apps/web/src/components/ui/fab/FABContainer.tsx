'use client'

import clsx from 'clsx'
import { typescriptHappyForwardRef } from 'foxact/typescript-happy-forward-ref'
import { atom, useAtomValue } from 'jotai'
import type { HTMLMotionProps } from 'motion/react'
import { AnimatePresence, m } from 'motion/react'
import { useTranslations } from 'next-intl'
import type * as React from 'react'
import type { JSX, PropsWithChildren, ReactNode } from 'react'
import { useId } from 'react'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { useTypeScriptHappyCallback } from '~/hooks/common/use-callback'
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
    const t = useTranslations('common')
    const { children, show = true, ...extra } = props
    const { className, ...rest } = extra

    return (
      <AnimatePresence>
        {show && (
          <m.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
            ref={ref}
            aria-label={t('aria_fab')}
            className={clsxm(
              'mt-2 flex items-center justify-center',
              'size-12 text-lg md:size-10 md:text-base',
              'outline-accent hover:opacity-100 focus:opacity-100 focus:outline-hidden',
              'rounded-xl border border-zinc-400/20 backdrop-blur-lg dark:border-zinc-500/30 dark:text-zinc-200',
              'bg-zinc-50/80 shadow-lg dark:bg-neutral-900/80',

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
      show?: boolean
    },
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const { onClick, children, show = true } = props
    const id = useId()
    const portalElement = useAtomValue(fabContainerElementAtom)
    const isMobile = useIsMobile()
    if (props.onlyShowInMobile && !isMobile) return null
    if (!portalElement) return null

    return (
      <RootPortal to={portalElement}>
        <FABBase ref={ref} id={id} show={show} onClick={onClick}>
          {children}
        </FABBase>
      </RootPortal>
    )
  },
)

export const FABContainer = (props: { children?: ReactNode }) => {
  const isMobile = useIsMobile()

  const shouldHide = usePageScrollDirectionSelector(
    (direction) => isMobile && direction === 'down',
    [isMobile],
  )

  return (
    <div
      ref={useTypeScriptHappyCallback(
        (el) => jotaiStore.set(fabContainerElementAtom, el),
        [],
      )}
      data-testid="fab-container"
      data-hide-print
      className={clsx(
        'fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] left-[calc(100vw-3rem-1rem)] z-[9] flex flex-col',
        shouldHide ? 'translate-x-[calc(100%+2rem)]' : '',
        'transition-transform duration-300 ease-in-out',
      )}
    >
      {props.children}
    </div>
  )
}
