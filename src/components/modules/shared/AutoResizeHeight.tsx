'use client'

import { m } from 'motion/react'
import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import { softSpringPreset } from '~/constants/spring'
import { clsxm } from '~/lib/helper'

interface AnimateChangeInHeightProps {
  children: React.ReactNode
  className?: string
  duration?: number

  spring?: boolean
}

export const AutoResizeHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
  duration = 0.6,
  spring = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // We only have one entry, so we can use entries[0].
        const observedHeight = entries[0].contentRect.height
        setHeight(observedHeight)
      })

      resizeObserver.observe(containerRef.current)

      return () => {
        // Cleanup the observer when the component is unmounted
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <m.div
      className={clsxm('overflow-hidden', className)}
      style={{ height }}
      initial={false}
      animate={{ height }}
      transition={spring ? softSpringPreset : { duration }}
    >
      <div ref={containerRef}>{children}</div>
    </m.div>
  )
}
