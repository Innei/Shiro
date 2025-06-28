'use client'

import { createTransitionView } from '~/components/ui/transition/factor'

export const Transition = createTransitionView({
  from: {
    y: 80,
    opacity: 0.001,
  },
  to: {
    y: 0,
    opacity: 1,
  },
  preset: {
    type: 'spring',
    damping: 20,
    stiffness: 200,
  },
})
