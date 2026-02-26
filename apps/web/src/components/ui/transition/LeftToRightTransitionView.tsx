'use client'

import { createTransitionView } from './factor'

export const LeftToRightTransitionView = createTransitionView({
  from: {
    x: -70,
    opacity: 0.001,
  },
  to: {
    x: 0,
    opacity: 1,
  },
})
