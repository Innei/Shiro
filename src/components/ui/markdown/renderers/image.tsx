'use client'
import clsx from 'clsx'
import Image from 'next/image'
import type { FC } from 'react'
import { memo, useRef } from 'react'
import { Blurhash } from 'react-blurhash'
import { PhotoProvider, PhotoView } from 'react-photo-view'

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
  const mediaInfo = useMarkdownImageRecord(src)

  if (isVideoExt(ext)) {
    const figcaption = alt?.replace(/^[¡!]/, '')
    return (
      <div className="flex flex-col items-center">
        <video
          src={src}
          className={mediaInfo && 'fit'}
          style={
            {
              '--video-height': mediaInfo?.height,
              '--video-width': mediaInfo?.width,
            } as any
          }
          controls
          playsInline
          autoPlay={false}
        />

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

export const GridMarkdownImage = (props: any) => (
  <WrappedElementProvider>
    <div className="relative flex min-w-0 grow">
      <MarkdownImage {...props} />
    </div>
  </WrappedElementProvider>
)

export const GridMarkdownImages: FC<{
  imagesSrc: string[]
  Wrapper: Component
  height: number
}> = ({ imagesSrc, Wrapper, height = 1 }) => (
  <div
    className="relative"
    style={{
      paddingBottom: `${height * 100}%`,
    }}
  >
    <PhotoProvider photoClosable>
      <Wrapper className="absolute inset-0">
        {imagesSrc.map((src) => (
          <GridZoomImage key={src} src={src} />
        ))}
      </Wrapper>
    </PhotoProvider>
  </div>
)

const GridZoomImage: FC<{ src: string }> = memo(({ src }) => {
  const { accent, height, width, blurHash } = useMarkdownImageRecord(src) || {}
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
      {!!blurHash && (
        <Blurhash
          hash={blurHash}
          resolutionX={32}
          resolutionY={32}
          className="!size-full"
        />
      )}
      <LazyLoad offset={30}>
        <PhotoView src={src}>
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
          />
        </PhotoView>
      </LazyLoad>
    </div>
  )
})

GridZoomImage.displayName = 'GridZoomImage'
