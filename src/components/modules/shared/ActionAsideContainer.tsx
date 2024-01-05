'use client'

import { useViewport } from '~/atoms'
import { clsxm } from '~/lib/helper'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'
import { useIsEoFWrappedElement } from '~/providers/shared/WrappedElementProvider'

export const asideButtonStyles = {
  base: 'text-[24px] opacity-80 duration-200 hover:opacity-100 relative',
}

export const ActionAsideIcon: Component = (props) => {
  return <i className={clsxm(asideButtonStyles.base, props.className)} />
}
export const ActionAsideContainer: Component = ({ className, children }) => {
  const isEOA = useIsEoFWrappedElement()
  const h = useViewport((v) => v.h)

  const isEndOfPage = usePageScrollLocationSelector(
    (y) => {
      const threshold = 100

      return y + h >= document.body.scrollHeight - threshold
    },
    [h],
  )

  return (
    <div
      className={clsxm(
        'absolute bottom-0 left-0 -mb-4 flex max-h-[300px] flex-col gap-6 p-4 transition-all duration-200 ease-in-out',
        !isEOA ? 'opacity-20 hover:opacity-100' : '',
        className,
        isEndOfPage && 'bottom-[-30px] flex-row',
      )}
    >
      {children}
    </div>
  )
}
