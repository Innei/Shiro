'use client'

import * as React from 'react'
import { AnimatePresence, m } from 'framer-motion'

import { microReboundPreset } from '~/constants/spring'

export const Collapse = ({
  isOpened,
  className,
  children,
}: React.PropsWithChildren<{ isOpened: boolean } & { className?: string }>) => {
  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <>
      <AnimatePresence initial={false}>
        {isOpened && (
          <m.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
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
            }}
            className={className}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
