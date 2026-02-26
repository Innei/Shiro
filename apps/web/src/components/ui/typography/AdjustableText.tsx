import type * as React from 'react'
import { useEffect, useRef, useState } from 'react'

interface IProps {
  style?: React.CSSProperties

  padding?: number
  scale?: number
}

export const AdjustableText: React.FC<
  IProps & {
    children: string
  }
> = ({ children, style = {}, scale = 1, padding = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState<string | undefined>()

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      cal()
    })

    observer.observe(containerRef.current!)

    cal()
    return () => {
      observer.disconnect()
    }

    function cal() {
      const $container = containerRef.current?.parentElement
      const $ghost = ghostRef.current
      if (!$container || !$ghost) return
      const containerWidth = $container.clientWidth - padding * 2
      const ghostWidth = $ghost.offsetWidth

      if (containerWidth && ghostWidth && ghostWidth > containerWidth) {
        const newFontSize = (containerWidth / ghostWidth) * scale
        setFontSize(`${newFontSize}em`)
      }
    }
  }, [children])

  return (
    <>
      <span
        ref={containerRef}
        className="whitespace-nowrap"
        style={{ ...style, fontSize }}
      >
        {children}
      </span>
      <span
        ref={ghostRef}
        className="invisible absolute whitespace-nowrap"
        style={style}
      >
        {children}
      </span>
    </>
  )
}
