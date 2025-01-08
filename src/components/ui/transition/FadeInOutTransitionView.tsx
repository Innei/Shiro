'use client'

import { createTransitionView } from './factor'

export const FadeInOutTransitionView = createTransitionView({
  from: {
    opacity: 0.001,
  },
  to: {
    opacity: 1,
  },
})
