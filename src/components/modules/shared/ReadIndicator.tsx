'use client'

import { useDeferredValue } from 'react'
import { useInView } from 'react-intersection-observer'
import type { ElementType } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { RootPortal } from '~/components/ui/portal'
import { useReadPercent } from '~/hooks/shared/use-read-percent'
import { clsxm } from '~/lib/helper'
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
      {readPercent}%
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
