import type { MotionProps, TargetAndTransition } from 'motion/react'

import { microReboundPreset } from '~/constants/spring'

const enterStyle: TargetAndTransition = {
  scale: 1,
  opacity: 1,
}
const initialStyle: TargetAndTransition = {
  scale: 0.96,
  opacity: 0,
}

export const modalMontionConfig: MotionProps = {
  initial: initialStyle,
  animate: enterStyle,
  exit: initialStyle,
  transition: microReboundPreset,
}

export const MODAL_STACK_Z_INDEX = 100
