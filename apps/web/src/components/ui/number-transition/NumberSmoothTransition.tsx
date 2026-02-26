'use client'

import { AnimatePresence, m } from 'motion/react'

import { microDampingPreset } from '~/constants/spring'
import useDebounceValue from '~/hooks/common/use-debounce-value'

export const NumberSmoothTransition = (props: {
  children: string | number
}) => {
  const { children } = props
  const debouncedChildren = useDebounceValue(children, 300)
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <m.span
        key={debouncedChildren}
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
          position: 'absolute',
        }}
        transition={microDampingPreset}
      >
        {debouncedChildren}
      </m.span>
    </AnimatePresence>
  )
}
