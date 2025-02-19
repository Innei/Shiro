'use client'

import clsx from 'clsx'
import mediumZoom from 'medium-zoom'
import Image from 'next/image'
import type { FC } from 'react'
import * as React from 'react'
import { memo, useRef } from 'react'

import { LazyLoad } from '~/components/common/Lazyload'
import { addImageUrlResizeQuery } from '~/lib/image'
import { isVideoExt } from '~/lib/mine-type'
import { useMarkdownImageRecord } from '~/providers/article/MarkdownImageRecordProvider'
import {
  useWrappedElementSize,
  WrappedElementProvider,
} from '~/providers/shared/WrappedElementProvider'

import { Divider } from '../../divider/Divider'
import { FixedZoomedImage } from '../../image/ZoomedImage'

export const MarkdownImage = (props: { src: string; alt?: string }) => {
  const { src, alt } = props
  const nextProps = {
    ...props,
  }
  nextProps.alt = alt?.replace(/^[¡!]/, '')
  const { w } = useWrappedElementSize()

  const ext = src.split('.').pop()!
  if (isVideoExt(ext)) {
    const figcaption = alt?.replace(/^[¡!]/, '')
    return (
      <div className="flex flex-col items-center">
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
      <div className="relative flex min-w-0 grow">
        <MarkdownImage {...props} />
      </div>
    </WrappedElementProvider>
  )
}

export const GridMarkdownImages: FC<{
  imagesSrc: string[]
  Wrapper: Component
  height: number
}> = ({ imagesSrc, Wrapper, height = 1 }) => {
  return (
    <div
      className="relative"
      style={{
        paddingBottom: `${height * 100}%`,
      }}
    >
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
  const cropUrl = addImageUrlResizeQuery(src, 600)
  const imageEl = useRef<HTMLImageElement>(null)
  const wGreaterThanH = width && height ? width > height : true

  const ImageComponent = height && width ? Image : 'img'

  return (
    <div
      className="center relative flex size-full overflow-hidden rounded-md bg-cover bg-center"
      style={{
        backgroundColor: accent,
      }}
    >
      <LazyLoad offset={30}>
        <ImageComponent
          loading="lazy"
          alt=""
          height={height}
          width={width}
          src={cropUrl}
          ref={imageEl}
          className={clsx(
            '!m-0 max-w-max object-cover',
            wGreaterThanH ? 'h-full' : 'w-full',
          )}
          data-zoom-src={src}
          onClick={() => {
            if (!imageEl.current) return
            mediumZoom(imageEl.current).open()
          }}
        />
      </LazyLoad>
    </div>
  )
})

GridZoomImage.displayName = 'GridZoomImage'
