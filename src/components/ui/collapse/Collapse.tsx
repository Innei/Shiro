'use client'

import clsx from 'clsx'
import type { Variants } from 'motion/react'
import { AnimatePresence, m } from 'motion/react'
import * as React from 'react'

import { IonIosArrowDown } from '~/components/icons/arrow'
import { microReboundPreset } from '~/constants/spring'
import { clsxm } from '~/lib/helper'

export const Collapse: Component<{
  title: React.ReactNode
}> = (props) => {
  const [isOpened, setIsOpened] = React.useState(false)
  return (
    <div className="flex flex-col">
      <div
        className="flex w-full cursor-pointer items-center justify-between"
        onClick={() => setIsOpened((v) => !v)}
      >
        <span className="w-0 shrink grow truncate">{props.title}</span>
        <div
          className={clsx('shrink-0 text-gray-400', isOpened && 'rotate-180')}
        >
          <IonIosArrowDown />
        </div>
      </div>
      <CollapseContent isOpened={isOpened}>{props.children}</CollapseContent>
    </div>
  )
}

export const CollapseContent: Component<{
  isOpened: boolean
  withBackground?: boolean
}> = ({
  isOpened,
  className,
  children,

  withBackground = false,
}) => {
  const variants = React.useMemo(() => {
    const v = {
      open: {
        opacity: 1,
        height: 'auto',
        transition: microReboundPreset,
      },
      collapsed: {
        opacity: 0,
        height: 0,
        overflow: 'hidden',
      },
    } satisfies Variants

    if (withBackground) {
      // @ts-expect-error
      v.open.background = `oklch(var(--a) / 10%)`
      // @ts-expect-error
      v.collapsed.background = `oklch(var(--a) / 0%)`
    }

    return v
  }, [withBackground])
  return (
    <>
      <AnimatePresence initial={false}>
        {isOpened && (
          <m.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={variants}
            className={clsxm(withBackground && 'rounded-lg', className)}
          >
            {withBackground ? <div className="p-4">{children}</div> : children}
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
