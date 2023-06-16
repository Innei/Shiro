import React from 'react'

import { useIsClient } from '~/hooks/common/use-is-client'
import { clsxm } from '~/utils/helper'

export type LoadingProps = {
  loadingText?: string
  useDefaultLoadingText?: boolean
}

const defaultLoadingText = '别着急，坐和放宽'
export const Loading: Component<LoadingProps> = ({
  loadingText,
  className,
  useDefaultLoadingText = false,
}) => {
  const isClient = useIsClient()
  if (!isClient) return null
  const nextLoadingText = useDefaultLoadingText
    ? defaultLoadingText
    : loadingText
  return (
    <div
      className={clsxm('flex flex-col items-center justify-start', className)}
    >
      <span className="loading loading-ball loading-lg" />
      {!!nextLoadingText && (
        <span className="mt-6 block">{nextLoadingText}</span>
      )}
    </div>
  )
}
