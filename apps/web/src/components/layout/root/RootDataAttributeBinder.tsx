'use client'

import { useEffect, useRef } from 'react'

import {
  useIsFocusReading,
  useIsInReading,
  useIsMouseInMarkdown,
} from '~/atoms/hooks/reading'

export const RootDataAttributeBinder = () => {
  const isInReading = useIsInReading()
  const isFocusReading = useIsFocusReading()
  const isMouseInMarkdown = useIsMouseInMarkdown()
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = document.getElementById('root') as HTMLDivElement
    if (!root) return
    rootRef.current = root

    // 设置 data 属性
    root.dataset.readingMode = isInReading ? 'true' : 'false'
    root.dataset.focusReading = isFocusReading ? 'true' : 'false'
    root.dataset.immersiveReading =
      isInReading && isFocusReading && isMouseInMarkdown ? 'true' : 'false'
  }, [isInReading, isFocusReading, isMouseInMarkdown])

  return null
}
