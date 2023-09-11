'use client'

import * as React from 'react'
import { AnimatePresence, m } from 'framer-motion'
import type { Variants } from 'framer-motion'

import { microReboundPreset } from '~/constants/spring'
import { clsxm } from '~/lib/helper'

export const Collapse: Component<{
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
      v.open.background = `hsl(var(--a) / 10%)`
      // @ts-expect-error
      v.collapsed.background = `hsl(var(--a) / 0%)`
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
