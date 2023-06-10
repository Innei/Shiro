'use client'

import { createTransitionView } from './factor'

export const RightToLeftTransitionView = createTransitionView({
  from: {
    translateX: 42,
    opacity: 0,
  },
  to: {
    translateX: 0,
    opacity: 1,
  },
})
