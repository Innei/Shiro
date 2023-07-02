'use client'

import { AnimatePresence, m } from 'framer-motion'

import { microdampingPreset } from '~/constants/spring'

export const NumberSmoothTransition = (props: {
  children: string | number
}) => {
  const { children } = props
  return (
    <AnimatePresence mode="popLayout">
      <m.span
        key={children}
        initial={{
          opacity: 0,
          y: -16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -16,
        }}
        transition={microdampingPreset}
      >
        {children}
      </m.span>
    </AnimatePresence>
  )
}
