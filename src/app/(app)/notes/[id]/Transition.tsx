'use client'

import { createTransitionView } from '~/components/ui/transition/factor'

export const Transition = createTransitionView({
  from: {
    translateY: 80,
    opacity: 0.001,
  },
  to: {
    translateY: 0,
    opacity: 1,
  },
  preset: {
    type: 'spring',
    damping: 20,
    stiffness: 200,
  },
})
