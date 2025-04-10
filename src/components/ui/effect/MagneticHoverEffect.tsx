'use client'

import * as React from 'react'
import { useCallback, useRef } from 'react'

import { clsxm } from '~/lib/helper'

type MagneticHoverEffectProps<T extends React.ElementType> = {
  as?: T
  children: React.ReactNode
  variant?: 'default' | 'accent'
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>

export const MagneticHoverEffect = <T extends React.ElementType = 'div'>({
  as,
  children,
  variant = 'default',
  ...rest
}: MagneticHoverEffectProps<T>) => {
  const Component = as || 'div'

  const itemRef = useRef<HTMLElement>(null)

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!itemRef.current) return
    const rect = itemRef.current.getBoundingClientRect()

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    itemRef.current.style.transition =
      'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)'
    itemRef.current.style.setProperty('--origin-x', `${x}%`)
    itemRef.current.style.setProperty('--origin-y', `${y}%`)
  }

  const handleMouseLeave = () => {
    if (!itemRef.current) return
    itemRef.current.style.transform = 'translate(0px, 0px)'
    itemRef.current.style.transition =
      'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)'
  }

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!itemRef.current) return
    const rect = itemRef.current.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = (e.clientX - centerX) * 0.05
    const distanceY = (e.clientY - centerY) * 0.05

    itemRef.current.style.transform = `translate(${distanceX}px, ${distanceY}px)`
  }, [])

  return (
    <Component
      ref={itemRef as any}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...rest}
      className={clsxm(
        'relative !cursor-none',
        'inline-block transition-all duration-200 ease-out',

        'before:absolute before:-inset-x-2 before:inset-y-0 before:z-[-1] before:scale-[0.92] before:rounded-xl before:opacity-0 before:backdrop-blur before:transition-all before:duration-200 before:[transform-origin:var(--origin-x)_var(--origin-y)] hover:before:scale-100 hover:before:opacity-100',
        variant === 'accent'
          ? 'before:bg-accent/50'
          : 'before:bg-black/[0.03] dark:before:bg-white/10',

        rest.className,
      )}
    >
      {children}
    </Component>
  )
}
