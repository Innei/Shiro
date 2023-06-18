import { memo } from 'react'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'

import { microReboundPreset } from '~/constants/spring'

export const MotionButtonBase: Component<HTMLMotionProps<'button'>> = memo(
  ({ children, ...rest }) => {
    return (
      <motion.button
        initial={true}
        whileFocus={{ scale: 1.05 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ ...microReboundPreset }}
        {...rest}
      >
        {children}
      </motion.button>
    )
  },
)
