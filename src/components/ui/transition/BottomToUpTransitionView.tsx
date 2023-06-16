'use client'

import { createTransitionView } from './factor'

export const BottomToUpTransitionView = createTransitionView({
  from: {
    translateY: 50,
    opacity: 0,
  },
  to: {
    translateY: 0,
    opacity: 1,
  },
})
