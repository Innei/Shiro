'use client'

import React, { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'

import { clsxm } from '~/lib/helper'

interface AnimateChangeInHeightProps {
  children: React.ReactNode
  className?: string
  duration?: number
}

export const AutoResizeHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
  duration = 0.6,
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
      transition={{ duration }}
    >
      <div ref={containerRef}>{children}</div>
    </m.div>
  )
}
