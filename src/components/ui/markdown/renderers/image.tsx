'use client'

import React, { memo, useRef } from 'react'
import clsx from 'clsx'
import mediumZoom from 'medium-zoom'
import type { FC } from 'react'

import { addImageUrlResizeQuery } from '~/lib/image'
import { isVideoExt } from '~/lib/mine-type'
import { useMarkdownImageRecord } from '~/providers/article/MarkdownImageRecordProvider'
import {
  useWrappedElementSize,
  WrappedElementProvider,
} from '~/providers/shared/WrappedElementProvider'

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

export const GridMarkdownImage = (props: any) => {
  return (
    <WrappedElementProvider>
      <div className="relative flex min-w-0 flex-grow">
        <MarkdownImage {...props} />
      </div>
    </WrappedElementProvider>
  )
}

export const GridMarkdownImages: FC<{
  imagesSrc: string[]
  Wrapper: Component
}> = ({ imagesSrc, Wrapper }) => {
  return (
    <div className="relative pb-[100%]">
      <Wrapper className="absolute inset-0">
        {imagesSrc.map((src) => {
          return <GridZoomImage key={src} src={src} />
        })}
      </Wrapper>
    </div>
  )
}

const GridZoomImage: FC<{ src: string }> = memo(({ src }) => {
  const { accent, height, width } = useMarkdownImageRecord(src) || {}
  const cropUrl = addImageUrlResizeQuery(src, 300)
  const imageEl = useRef<HTMLImageElement>(null)
  const wGreaterThanH = width && height ? width > height : true

  return (
    <div
      className="relative flex h-full w-full overflow-hidden rounded-md bg-cover bg-center center"
      style={{
        backgroundColor: accent,
      }}
    >
      <img
        alt=""
        height={height}
        width={width}
        src={cropUrl}
        ref={imageEl}
        className={clsx(
          '!mx-0 !my-0 max-w-max object-cover',
          wGreaterThanH ? 'h-full' : 'w-full',
        )}
        data-zoom-src={src}
        onClick={() => {
          if (!imageEl.current) return
          mediumZoom(imageEl.current).open()
        }}
      />
    </div>
  )
})

GridZoomImage.displayName = 'GridZoomImage'
