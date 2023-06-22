'use client'

import type { FC, PropsWithChildren } from 'react'
import type { BaseTransitionProps } from './typings'

import { createTransitionView } from './factor'

export const FadeInOutTransitionView: FC<
  PropsWithChildren<BaseTransitionProps>
> = createTransitionView({
  from: {
    opacity: 0.001,
  },
  to: {
    opacity: 1,
  },
})
