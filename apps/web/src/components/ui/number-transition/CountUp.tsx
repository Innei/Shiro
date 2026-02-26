'use client'

import { animate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useStateToRef } from '~/hooks/common/use-state-ref'

export const CountUp: Component<{
  to: number
  decimals: number
  duration: number
}> = (props) => {
  const { to, className, decimals, duration } = props
  const [prev, setPrev] = useState(0)
  const [initialNumber, setInitialNumber] = useState(to)
  const initialNumberRef = useStateToRef(initialNumber)
  const nodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setPrev(initialNumberRef.current)
    setInitialNumber(to)
  }, [to])
  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const controls = animate(prev || initialNumber, initialNumber, {
      duration,
      onUpdate(value) {
        node.textContent = value.toFixed(decimals)
      },
    })

    return () => controls.stop()
  }, [prev, initialNumber, decimals, duration])

  return <span className={className} ref={nodeRef} />
}
