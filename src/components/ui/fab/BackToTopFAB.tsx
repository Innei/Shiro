'use client'

import { useViewport } from '~/atoms/hooks'
import { springScrollToTop } from '~/lib/scroller'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'

import { FABPortable } from './FABContainer'

export const BackToTopFAB = () => {
  const windowHeight = useViewport((v) => v.h)
  const shouldShow = usePageScrollLocationSelector(
    (scrollTop) => {
      return scrollTop > windowHeight / 5
    },
    [windowHeight],
  )

  return (
    <FABPortable onClick={springScrollToTop} show={shouldShow}>
      <i className="i-mingcute-arow-to-up-line" />
    </FABPortable>
  )
}
