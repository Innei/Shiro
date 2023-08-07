'use client'

import React from 'react'

import { isVideoExt } from '~/lib/mine-type'
import { useWrappedElementSize } from '~/providers/shared/WrappedElementProvider'

import { Divider } from '../../divider/Divider'
import { FixedZoomedImage } from '../../image/ZoomedImage'

export const MarkdownImage = (props: any) => {
  const { src, alt } = props
  const nextProps = {
    ...props,
  }
  nextProps.alt = alt?.replace(/^[¡!]/, '')
  const { w } = useWrappedElementSize()

  const ext = src.split('.').pop()
  if (isVideoExt(ext)) {
    const figcaption = alt?.replace(/^[¡!]/, '')
    return (
      <div>
        <video src={src} controls playsInline autoPlay={false} />
        {figcaption && (
          <p className="mt-1 flex flex-col items-center justify-center text-sm">
            <Divider className="w-[80px] opacity-80" />
            <span className="opacity-90">{figcaption}</span>
          </p>
        )}
      </div>
    )
  }

  return <FixedZoomedImage {...nextProps} containerWidth={w} />
}
