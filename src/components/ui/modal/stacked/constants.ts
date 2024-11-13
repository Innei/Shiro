import type { AnimationProps, Target } from 'motion/react'

import { microReboundPreset } from '~/constants/spring'

const enterStyle: Target = {
  scale: 1,
  opacity: 1,
}
const initialStyle: Target = {
  scale: 0.96,
  opacity: 0,
}

export const modalMontionConfig: AnimationProps = {
  initial: initialStyle,
  animate: enterStyle,
  exit: initialStyle,
  transition: microReboundPreset,
}

export const MODAL_STACK_Z_INDEX = 100
