'use client'

import { useViewport } from '~/atoms'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'
import { springScrollToTop } from '~/utils/spring'

import { FABBase } from './FABContainer'

export const BackToTopFAB = () => {
  const windowHeight = useViewport((v) => v.h)
  const shouldShow = usePageScrollLocationSelector(
    (scrollTop) => {
      return scrollTop > windowHeight / 5
    },
    [windowHeight],
  )

  return (
    <FABBase
      id="to-top"
      aria-label="Back to top"
      show={shouldShow}
      onClick={springScrollToTop}
    >
      <i className="icon-[mingcute--arow-to-up-line]" />
    </FABBase>
  )
}
