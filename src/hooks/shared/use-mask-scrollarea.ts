import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { useViewport } from '~/atoms'

import { useEventCallback } from '../common/use-event-callback'

export const useMaskScrollArea = <T extends HTMLElement = HTMLElement>() => {
  const containerRef = useRef<T>(null)
  const [isScrollToBottom, setIsScrollToBottom] = useState(false)
  const [isScrollToTop, setIsScrollToTop] = useState(false)
  const [canScroll, setCanScroll] = useState(false)
  const h = useViewport((v) => v.h)

  const eventHandler = useEventCallback(() => {
    const $ = containerRef.current

    if (!$) return

    // if $ can not scroll, return null
    if ($.scrollHeight <= $.clientHeight + 2) return

    setCanScroll(true)

    // to bottom
    if ($.scrollTop + $.clientHeight + 20 > $.scrollHeight) {
      setIsScrollToBottom(true)
      setIsScrollToTop(false)
    }

    // if scroll to top,
    // set isScrollToTop to true
    else if ($.scrollTop < 20) {
      setIsScrollToTop(true)
      setIsScrollToBottom(false)
    } else {
      setIsScrollToBottom(false)
      setIsScrollToTop(false)
    }
  })
  useEffect(() => {
    const $ = containerRef.current
    if (!$) return
    $.addEventListener('scroll', eventHandler)

    eventHandler()

    return () => {
      $.removeEventListener('scroll', eventHandler)
    }
  }, [eventHandler])

  useEffect(() => {
    eventHandler()
  }, [eventHandler, h])

  return [
    containerRef,
    clsx(
      isScrollToBottom && 'mask-t',
      isScrollToTop && 'mask-b',
      canScroll && !isScrollToBottom && !isScrollToTop && 'mask-both',
    ),
  ]
}
