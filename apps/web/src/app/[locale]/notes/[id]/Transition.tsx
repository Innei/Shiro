'use client'

import { createTransitionView } from '~/components/ui/transition/factor'
import { Spring } from '~/constants/spring'

export const Transition = createTransitionView({
  from: {
    y: 80,
    opacity: 0.001,
  },
  to: {
    y: 0,
    opacity: 1,
  },

  preset: Spring.presets.snappy,
})
