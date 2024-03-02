import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { useViewport } from '~/atoms/hooks'

import { useEventCallback } from '../common/use-event-callback'

const THRESHOLD = 0
export const useMaskScrollArea = <T extends HTMLElement = HTMLElement>({
  ref,
  size = 'base',
  selector,
}: {
  ref?: React.RefObject<HTMLElement>
  size?: 'base' | 'lg'
  selector?: string
} = {}) => {
  const containerRef = useRef<T>(null)
  const [isScrollToBottom, setIsScrollToBottom] = useState(false)
  const [isScrollToTop, setIsScrollToTop] = useState(false)
  const [canScroll, setCanScroll] = useState(false)
  const h = useViewport((v) => v.h)

  const getDomRef = useCallback(() => {
    let $ = containerRef.current || ref?.current

    if (!$) return

    if (selector) {
      $ = $.querySelector(selector) as HTMLElement
    }
    return $
  }, [ref, selector])
  const eventHandler = useEventCallback(() => {
    const $ = getDomRef()
    if (!$) return
    // if $ can not scroll
    if ($.scrollHeight <= $.clientHeight + 2) {
      setCanScroll(false)
      setIsScrollToBottom(false)
      setIsScrollToTop(false)
      return
    }

    setCanScroll(true)

    // if $ can scroll
    const isScrollToBottom =
      $.scrollTop + $.clientHeight >= $.scrollHeight - THRESHOLD
    const isScrollToTop = $.scrollTop <= THRESHOLD
    setIsScrollToBottom(isScrollToBottom)
    setIsScrollToTop(isScrollToTop)
  })
  useEffect(() => {
    const $ = getDomRef()
    if (!$) return

    $.addEventListener('scroll', eventHandler)

    return () => {
      $.removeEventListener('scroll', eventHandler)
    }
  }, [eventHandler, getDomRef])

  useEffect(() => {
    eventHandler()
  }, [eventHandler, h])

  const postfixSize = {
    base: '',
    lg: '-lg',
  }[size]

  return [
    containerRef,
    canScroll
      ? clsx(
          isScrollToBottom && 'mask-t',
          isScrollToTop && 'mask-b',
          !isScrollToBottom && !isScrollToTop && 'mask-both',
        ) + postfixSize
      : '',
  ] as const
}
