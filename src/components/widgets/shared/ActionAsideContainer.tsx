'use client'

import { clsxm } from '~/lib/helper'
import { useIsEOWrappedElement } from '~/providers/shared/WrappedElementProvider'

export const ActionAsideContainer: Component = ({ className, children }) => {
  const isEOA = useIsEOWrappedElement()

  return (
    <div
      className={clsxm(
        'absolute bottom-0 left-0 max-h-[300px] flex-col space-y-8 transition-opacity duration-200 ease-in-out',
        !isEOA ? 'opacity-20 hover:opacity-100' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}
