'use client'

import { createTransitionView } from './factor'

export const RightToLeftTransitionView = createTransitionView({
  from: {
    x: 42,
    opacity: 0.001,
  },
  to: {
    x: 0,
    opacity: 1,
  },
})
