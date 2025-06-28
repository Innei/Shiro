'use client'

import { softBouncePreset, Spring } from '~/constants/spring'

import { createTransitionView } from './factor'

export const BottomToUpTransitionView = createTransitionView({
  from: {
    y: 50,
    opacity: 0.001,
  },
  to: {
    y: 0,
    opacity: 1,
  },
  preset: softBouncePreset,
})

export const BottomToUpSmoothTransitionView = createTransitionView({
  from: {
    y: 50,
    opacity: 0.001,
  },
  to: {
    y: 0,
    opacity: 1,
  },
  preset: Spring.presets.smooth,
})
