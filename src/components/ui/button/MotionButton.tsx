import { forwardRef, memo } from 'react'
import { motion } from 'framer-motion'
import type { ForwardRefComponent, HTMLMotionProps } from 'framer-motion'

import { microReboundPreset } from '~/constants/spring'

export const MotionButtonBase: ForwardRefComponent<
  HTMLButtonElement,
  HTMLMotionProps<'button'>
> = memo(
  forwardRef(({ children, ...rest }, ref) => {
    return (
      <motion.button
        initial={true}
        whileFocus={{ scale: 1.05 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ ...microReboundPreset }}
        {...rest}
        ref={ref}
      >
        {children}
      </motion.button>
    )
  }),
)
