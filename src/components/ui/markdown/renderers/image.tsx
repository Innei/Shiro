'use client'

import React, { memo, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import mediumZoom from 'medium-zoom'
import type { Zoom } from 'medium-zoom'
import type { FC } from 'react'

import { isServerSide } from '~/lib/env'
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

let zoomer: Zoom
const GridZoomImage: FC<{ src: string }> = memo(({ src }) => {
  const { accent } = useMarkdownImageRecord(src) || {}

  const [zoomer_] = useState(() => {
    if (isServerSide) return null
    if (zoomer) return zoomer
    const zoom = mediumZoom(undefined)
    zoomer = zoom
    return zoom
  })

  const imageEl = useRef<HTMLImageElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!zoomer_) return
    const $image = imageEl.current
    if (!$image) return

    zoomer_.attach($image)
    return () => {
      zoomer_.detach($image)
    }
  }, [])

  return (
    <div
      className="relative h-full w-full rounded-md bg-cover bg-center"
      style={{
        backgroundImage: `url(${src})`,
        backgroundColor: accent,
      }}
    >
      <img
        src={src}
        ref={imageEl}
        className="absolute inset-0 z-[1] !mx-0 !my-0 h-full w-full cursor-zoom-in opacity-0"
      />
    </div>
  )
})

GridZoomImage.displayName = 'GridZoomImage'
