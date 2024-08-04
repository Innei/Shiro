import React from 'react'

import { clsxm } from '~/lib/helper'

export type LoadingProps = {
  loadingText?: string
  useDefaultLoadingText?: boolean
}

const defaultLoadingText = 'Chill, sit back and relax'
export const Loading: Component<LoadingProps> = ({
  loadingText,
  className,
  useDefaultLoadingText = false,
}) => {
  const nextLoadingText = useDefaultLoadingText
    ? defaultLoadingText
    : loadingText
  return (
    <div
      data-hide-print
      className={clsxm('my-20 flex flex-col center', className)}
    >
      <span className="loading loading-ball loading-lg" />
      {!!nextLoadingText && (
        <span className="mt-6 block">{nextLoadingText}</span>
      )}
    </div>
  )
}

export const FullPageLoading = () => (
  <Loading useDefaultLoadingText className="h-[calc(100vh-6.5rem-10rem)]" />
)
