'use client'

import { forwardRef, memo } from 'react'
import { motion } from 'framer-motion'
import type { ForwardRefComponent, HTMLMotionProps } from 'framer-motion'

export const MotionButtonBase: ForwardRefComponent<
  HTMLButtonElement,
  HTMLMotionProps<'button'>
> = memo(
  forwardRef(({ children, ...rest }, ref) => {
    return (
      <motion.button
        initial={true}
        whileFocus={{ scale: 1.02 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        {...rest}
        ref={ref}
      >
        {children}
      </motion.button>
    )
  }),
)
