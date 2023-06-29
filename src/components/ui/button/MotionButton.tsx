'use client'

import { forwardRef, memo } from 'react'
import { m } from 'framer-motion'
import type { ForwardRefComponent, HTMLMotionProps } from 'framer-motion'

export const MotionButtonBase: ForwardRefComponent<
  HTMLButtonElement,
  HTMLMotionProps<'button'>
> = memo(
  forwardRef(({ children, ...rest }, ref) => {
    return (
      <m.button
        initial={true}
        whileFocus={{ scale: 1.02 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        {...rest}
        ref={ref}
      >
        {children}
      </m.button>
    )
  }),
)
