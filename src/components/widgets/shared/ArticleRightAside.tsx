'use client'

import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { TocAsideRef } from '../toc'

import { useIsMobile, useViewport } from '~/atoms'

import { TocAside } from '../toc'
import { ReadIndicator } from './ReadIndicator'

export const ArticleRightAside: Component = ({ children }) => {
  const isMobile = useIsMobile()
  if (isMobile) return <div />

  return <ArticleRightAsideImpl>{children}</ArticleRightAsideImpl>
}

const ArticleRightAsideImpl: Component = ({ children }) => {
  const asideRef = useRef<TocAsideRef>(null)
  const [isScrollToBottom, setIsScrollToBottom] = useState(false)
  const [isScrollToTop, setIsScrollToTop] = useState(false)
  const [canScroll, setCanScroll] = useState(false)
  const h = useViewport((v) => v.h)
  useEffect(() => {
    const $ = asideRef.current?.getContainer()
    if (!$) return

    // if $ can not scroll, return null
    if ($.scrollHeight <= $.clientHeight + 2) return

    setCanScroll(true)

    const handler = () => {
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
    }
    $.addEventListener('scroll', handler)

    handler()

    return () => {
      $.removeEventListener('scroll', handler)
    }
  }, [h])

  return (
    <aside className="sticky top-[120px] mt-[120px] h-[calc(100vh-6rem-4.5rem-150px-120px)]">
      <div className="relative h-full">
        <TocAside
          as="div"
          className="static ml-4"
          treeClassName={clsx(
            'absolute h-full min-h-[120px] flex flex-col',
            isScrollToBottom && 'mask-t',
            isScrollToTop && 'mask-b',
            canScroll && !isScrollToBottom && !isScrollToTop && 'mask-both',
          )}
          accessory={ReadIndicator}
          ref={asideRef}
        />
      </div>
      {React.cloneElement(children as any, {
        className: 'translate-y-[calc(100%+24px)]',
      })}
    </aside>
  )
}
