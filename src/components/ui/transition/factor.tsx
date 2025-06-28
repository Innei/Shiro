'use client'

import type {
  HTMLMotionProps,
  MotionProps,
  TargetAndTransition,
  Transition,
} from 'motion/react'
import { m } from 'motion/react'
import type { FC, PropsWithChildren } from 'react'
import { memo, useState } from 'react'

import { isHydrationEnded } from '~/components/common/HydrationEndDetector'
import { microReboundPreset } from '~/constants/spring'

import type { BaseTransitionProps } from './typings'

interface TransitionViewParams {
  from: TargetAndTransition
  to: TargetAndTransition
  initial?: TargetAndTransition
  preset?: Transition
}

export const createTransitionView = (params: TransitionViewParams) => {
  const { from, to, initial, preset } = params

  const TransitionView = ({
    ref,
    ...props
  }: PropsWithChildren<BaseTransitionProps> & {
    ref?: React.RefObject<HTMLElement | null>
  }) => {
    const {
      timeout = {},
      duration = 0.5,

      animation = {},
      as = 'div',
      delay = 0,
      lcpOptimization = false,
      ...rest
    } = props

    const { enter = delay, exit = delay } = timeout

    const MotionComponent = m[as] as FC<
      HTMLMotionProps<any> & { ref?: React.Ref<HTMLElement | null> }
    >

    const [stableIsHydrationEnded] = useState(isHydrationEnded)

    const motionProps: MotionProps = {
      initial: initial || from,
      animate: {
        ...to,
        transition: {
          duration,
          ...(preset || microReboundPreset),
          ...animation.enter,
          delay: enter / 1000,
        },
      },
      transition: {
        duration,
      },
      exit: {
        ...from,
        transition: {
          duration,
          ...animation.exit,
          delay: exit / 1000,
        } as TargetAndTransition['transition'],
      },
    }
    if (lcpOptimization && !stableIsHydrationEnded) {
      motionProps.initial = to
      delete motionProps.animate
    }

    return (
      <MotionComponent ref={ref} {...motionProps} {...rest}>
        {props.children}
      </MotionComponent>
    )
  }
  TransitionView.displayName = `forwardRef(TransitionView)`
  const MemoedTransitionView = memo(TransitionView)
  MemoedTransitionView.displayName = `MemoedTransitionView`
  return MemoedTransitionView
}
