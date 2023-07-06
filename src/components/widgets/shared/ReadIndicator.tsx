'use client'

import { useDeferredValue } from 'react'
import clsx from 'clsx'
import type { ElementType } from 'react'

import { useIsMobile } from '~/atoms'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import { RootPortal } from '~/components/ui/portal'
import useDebounceValue from '~/hooks/common/use-debounce-value'
import { useReadPercent } from '~/hooks/shared/use-read-percent'
import { clsxm } from '~/lib/helper'
import { useIsEOWrappedElement } from '~/providers/shared/WrappedElementProvider'

export const ReadIndicator: Component<{
  as?: ElementType
}> = ({ className, as }) => {
  const readPercent = useDebounceValue(useReadPercent(), 200)
  const As = as || 'span'
  return (
    <As className={clsxm('text-gray-800 dark:text-neutral-300', className)}>
      <NumberSmoothTransition>{readPercent}</NumberSmoothTransition>%
    </As>
  )
}

export const ReadIndicatorForMobile: Component<{}> = () => {
  const readPercent = useDeferredValue(useReadPercent())
  const isEOA = useIsEOWrappedElement()
  const isMobile = useIsMobile()
  if (!isMobile) return null

  return (
    <RootPortal>
      <div
        className={clsx(
          'fixed bottom-0 right-0 top-0 z-[99] w-[1px] transition-opacity duration-200 ease-in-out',
          isEOA ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div
          className="absolute top-0 w-full bg-accent/80"
          style={{
            height: `${readPercent}%`,
          }}
        />
      </div>
    </RootPortal>
  )
}
