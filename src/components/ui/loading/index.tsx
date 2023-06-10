import React from 'react'

import { useIsClient } from '~/hooks/common/use-is-client'
import { clsxm } from '~/utils/helper'

export type LoadingProps = {
  loadingText?: string
}

export const Loading: Component<LoadingProps> = ({
  loadingText,
  className,
}) => {
  const isClient = useIsClient()
  if (!isClient) return null

  return (
    <div
      className={clsxm('flex flex-col items-center justify-start', className)}
    >
      <span className="loading loading-spinner loading-lg" />
      {!!loadingText && <span className="mt-6 block">{loadingText}</span>}
    </div>
  )
}
