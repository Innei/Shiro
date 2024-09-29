import clsx from 'clsx'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { useCallback, useRef, useState } from 'react'

import { useViewport } from '~/atoms/hooks/viewport'
import { debounce } from '~/lib/lodash'

import { useEventCallback } from '../common/use-event-callback'

const THRESHOLD = 0

export const useContainerCanScroll = <T extends HTMLElement = HTMLElement>({
  ref,
  element,
  selector,
}: {
  ref?: React.RefObject<HTMLElement | null>
  element?: HTMLElement
  selector?: string
} = {}) => {
  const containerRef = useRef<T>(null)
  const [canScroll, setCanScroll] = useState(false)

  const getDomRef = useCallback(() => {
    let $ = containerRef.current || ref?.current || element

    if (!$) return

    if (selector) {
      $ = $.querySelector(selector) as HTMLElement
    }
    return $
  }, [ref, selector, element])

  const eventHandler = useEventCallback(() => {
    const $ = getDomRef()

    if (!$) return

    // if $ can not scroll
    if ($.scrollHeight <= $.clientHeight + 2) {
      setCanScroll(false)
      return
    }

    setCanScroll(true)
  })

  useIsomorphicLayoutEffect(() => {
    const $ = getDomRef()
    if (!$) return

    $.addEventListener('scroll', eventHandler)
    const resizeObserver = new ResizeObserver(debounce(eventHandler, 36))
    resizeObserver.observe($)
    return () => {
      $.removeEventListener('scroll', eventHandler)
      resizeObserver.disconnect()
    }
  }, [eventHandler, getDomRef, element])

  useIsomorphicLayoutEffect(() => {
    eventHandler()
  }, [eventHandler, element])

  return [containerRef, canScroll] as const
}
export const useMaskScrollArea = <T extends HTMLElement = HTMLElement>({
  ref,
  size = 'base',
  element,
  selector,
}: {
  ref?: React.RefObject<HTMLElement | null>
  element?: HTMLElement
  size?: 'base' | 'lg'
  selector?: string
} = {}) => {
  const containerRef = useRef<T>(null)
  const [isScrollToBottom, setIsScrollToBottom] = useState(false)
  const [isScrollToTop, setIsScrollToTop] = useState(false)
  const [, canScroll] = useContainerCanScroll({
    ref: containerRef,
    element,
    selector,
  })
  const h = useViewport((v) => v.h)

  const getDomRef = useCallback(() => {
    let $ = containerRef.current || ref?.current || element

    if (!$) return

    if (selector) {
      $ = $.querySelector(selector) as HTMLElement
    }
    return $
  }, [ref, selector, element])
  const eventHandler = useEventCallback(() => {
    const $ = getDomRef()

    if (!$) return

    // if $ can not scroll
    if ($.scrollHeight <= $.clientHeight + 2) {
      setIsScrollToBottom(false)
      setIsScrollToTop(false)
      return
    }

    // if $ can scroll
    const isScrollToBottom =
      $.scrollTop + $.clientHeight >= $.scrollHeight - THRESHOLD
    const isScrollToTop = $.scrollTop <= THRESHOLD
    setIsScrollToBottom(isScrollToBottom)
    setIsScrollToTop(isScrollToTop)
  })
  useIsomorphicLayoutEffect(() => {
    const $ = getDomRef()
    if (!$) return

    $.addEventListener('scroll', eventHandler)

    return () => {
      $.removeEventListener('scroll', eventHandler)
    }
  }, [eventHandler, getDomRef, element])

  useIsomorphicLayoutEffect(() => {
    eventHandler()
  }, [eventHandler, h, element])

  const postfixSize = {
    base: '',
    lg: '-lg',
  }[size]

  return [
    containerRef,
    canScroll
      ? clsx(
          // 'scroller',
          isScrollToBottom && 'mask-t',
          isScrollToTop && 'mask-b',
          !isScrollToBottom && !isScrollToTop && 'mask-both',
        ) + postfixSize
      : '',
  ] as const
}
