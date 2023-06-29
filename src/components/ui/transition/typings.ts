import type { HTMLMotionProps, m, TargetAndTransition } from 'framer-motion'

export interface BaseTransitionProps extends HTMLMotionProps<'div'> {
  duration?: number
  onEntered?: () => void
  appear?: boolean
  timeout?: {
    exit?: number
    enter?: number
  }

  delay?: number

  animation?: {
    enter?: TargetAndTransition['transition']
    exit?: TargetAndTransition['transition']
  }

  as?: keyof typeof m
}
