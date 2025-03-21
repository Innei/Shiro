'use client'

import { useAnimationControls } from 'motion/react'
import type { FC, JSX } from 'react'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { FadeInOutTransitionView } from '~/components/ui/transition'

interface IconTransitionProps {
  solidIcon: JSX.Element
  regularIcon: JSX.Element
  currentState: 'solid' | 'regular'
}
export const IconSmoothTransition: FC<IconTransitionProps> = (props) => {
  const { currentState: _currentState, regularIcon, solidIcon } = props

  const map = {
    solid: solidIcon,
    regular: regularIcon,
  }

  const [currentState, setCurrentState] = useState<'solid' | 'regular'>(
    _currentState,
  )
  const controls = useAnimationControls()

  useEffect(() => {
    controls.start({ opacity: 0.001 }).then(() => {
      setCurrentState(_currentState)
      requestAnimationFrame(() => {
        controls.start({ opacity: 1 })
      })
    })
  }, [_currentState])

  return (
    <FadeInOutTransitionView
      initial
      animate={controls}
      transition={{ duration: 0.2 }}
      key={currentState}
    >
      {map[currentState]}
    </FadeInOutTransitionView>
  )
}
