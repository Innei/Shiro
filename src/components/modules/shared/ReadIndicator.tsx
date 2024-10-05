'use client'

import type { ElementType } from 'react'
import { useDeferredValue } from 'react'
import { useInView } from 'react-intersection-observer'

import { useIsMobile } from '~/atoms/hooks'
import { MaterialSymbolsProgressActivity } from '~/components/icons/Progress'
import { MotionButtonBase } from '~/components/ui/button'
import { RootPortal } from '~/components/ui/portal'
import { useReadPercent } from '~/hooks/shared/use-read-percent'
import { clsxm } from '~/lib/helper'
import { springScrollToTop } from '~/lib/scroller'
import { useIsEoFWrappedElement } from '~/providers/shared/WrappedElementProvider'

export const ReadIndicator: Component<{
  as?: ElementType
}> = ({ className, as }) => {
  const readPercent = useReadPercent()
  const As = as || 'span'

  const { ref, inView } = useInView()

  return (
    <As
      className={clsxm('text-gray-800 dark:text-neutral-300', className)}
      ref={ref}
    >
      <div className="flex items-center gap-2">
        <MaterialSymbolsProgressActivity />
        {readPercent}%<br />
      </div>
      <MotionButtonBase
        onClick={springScrollToTop}
        className={clsxm(
          'mt-1 flex flex-nowrap items-center gap-2 opacity-50 transition-all duration-500 hover:opacity-100',
          readPercent > 10 ? '' : 'pointer-events-none opacity-0',
        )}
      >
        <i className="i-mingcute-arrow-up-circle-line" />
        <span className="whitespace-nowrap">回到顶部</span>
      </MotionButtonBase>
      {!inView && <ReadIndicatorVertical className="right-px" />}
    </As>
  )
}

const ReadIndicatorVertical: Component = ({ className }) => {
  const readPercent = useDeferredValue(useReadPercent())
  const isEOA = useIsEoFWrappedElement()
  return (
    <RootPortal>
      <div
        className={clsxm(
          'fixed inset-y-0 right-0 z-[99] w-px transition-opacity duration-200 ease-in-out',
          isEOA ? 'opacity-0' : 'opacity-100',
          className,
        )}
      >
        <div
          className="absolute top-0 w-full bg-accent/80 duration-75 ease-linear"
          style={{
            height: `${readPercent}%`,
          }}
        />
      </div>
    </RootPortal>
  )
}
export const ReadIndicatorForMobile: Component<{}> = () => {
  const isMobile = useIsMobile()
  if (!isMobile) return null

  return <ReadIndicatorVertical />
}
