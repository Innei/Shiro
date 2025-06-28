import type { HTMLMotionProps, m, TargetAndTransition } from 'motion/react'

export interface BaseTransitionProps
  extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  duration?: number

  timeout?: {
    exit?: number
    enter?: number
  }

  delay?: number

  animation?: {
    enter?: TargetAndTransition['transition']
    exit?: TargetAndTransition['transition']
  }

  lcpOptimization?: boolean
  as?: keyof typeof m
}
