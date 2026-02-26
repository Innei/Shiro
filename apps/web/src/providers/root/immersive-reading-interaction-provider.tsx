'use client'

import { throttle } from 'es-toolkit'
import { useEffect } from 'react'

import {
  setIsImmersiveReadingEnabled,
  setIsMouseInMarkdown,
  useIsFocusReading,
  useMainMarkdownElement,
} from '~/atoms/hooks/reading'

export const ImmersiveReadingInteractionProvider = () => {
  const isFocusReading = useIsFocusReading()
  const mainMarkdownElement = useMainMarkdownElement()

  // 鼠标移动检测（仅在 focusReading=true 时激活）
  useEffect(() => {
    if (!isFocusReading) {
      setIsMouseInMarkdown(false)
      setIsImmersiveReadingEnabled(false)
      return
    }

    if (!mainMarkdownElement) {
      setIsMouseInMarkdown(false)
      setIsImmersiveReadingEnabled(false)
      return
    }

    const handleMouseMove = throttle((e: MouseEvent) => {
      const rect = mainMarkdownElement.getBoundingClientRect()
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      setIsMouseInMarkdown(isInside)
      setIsImmersiveReadingEnabled(isInside)
    }, 300)

    document.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isFocusReading, mainMarkdownElement])

  return null
}
