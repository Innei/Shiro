import type {
  HTMLMotionProps,
  Inertia,
  Keyframes,
  Spring,
  Tween,
  motion,
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
    enter?: Tween | Spring | Keyframes | Inertia
    exit?: Tween | Spring | Keyframes | Inertia
  }
  /**
   * @default true
   */
  useAnimatePresence?: boolean

  as?: keyof typeof motion
}
