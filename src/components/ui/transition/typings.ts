import type {
  HTMLMotionProps,
  motion,
  TargetAndTransition,
} from 'framer-motion'

export interface BaseTransitionProps extends HTMLMotionProps<'div'> {
  in?: boolean
  onExited?: () => void
  duration?: number
  onEntered?: () => void
  appear?: boolean
  timeout?: {
    exit?: number
    enter?: number
  }

  animation?: {
    enter?: TargetAndTransition['transition']
    exit?: TargetAndTransition['transition']
  }
  /**
   * @default true
   */
  useAnimatePresence?: boolean

  as?: keyof typeof motion
}
