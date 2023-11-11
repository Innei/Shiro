'use client'

import { isServer } from '@tanstack/react-query'
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import mediumZoom from 'medium-zoom'
import Image from 'next/image'
import { tv } from 'tailwind-variants'
import type { Zoom } from 'medium-zoom'
import type { FC, ReactNode } from 'react'

import { LazyLoad } from '~/components/common/Lazyload'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { calculateDimensions } from '~/lib/calc-image'
import { isDev } from '~/lib/env'
import { clsxm } from '~/lib/helper'
import { useMarkdownImageRecord } from '~/providers/article/MarkdownImageRecordProvider'

import { Divider } from '../divider'
import imageStyles from './ZoomedImage.module.css'

type TImageProps = {
  src: string
  alt?: string
  title?: string
  accent?: string
}

type BaseImageProps = {
  zoom?: boolean
  placeholder?: ReactNode
}

export enum ImageLoadStatus {
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}

const styles = tv({
  base: 'rounded-xl overflow-hidden text-center inline-flex items-center justify-center duration-200',
  variants: {
    status: {
      loading: 'hidden opacity-0',
      loaded: 'opacity-100 block',
      error: 'hidden opacity-0',
    },
  },
})

let zoomer: Zoom

export const ImageLazy: Component<TImageProps & BaseImageProps> = ({
  alt,
  src,
  title,
  zoom,

  placeholder,
}) => {
  // @ts-ignore
  const [zoomer_] = useState(() => {
    if (isServer) return null
    if (zoomer) return zoomer
    const zoom = mediumZoom(undefined)
    zoomer = zoom
    return zoom
  }) as [Zoom]

  const figcaption = title || alt
  const [imageLoadStatus, setImageLoadStatus] = useState(
    ImageLoadStatus.Loading,
  )
  const isUnmount = useIsUnMounted()
  const setImageLoadStatusSafe = useCallback(
    (status: ImageLoadStatus) => {
      if (!isUnmount.current) {
        setImageLoadStatus(status)
      }
    },
    [isUnmount],
  )
  const imageRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (imageLoadStatus !== ImageLoadStatus.Loaded) {
      return
    }
    if (!zoom) {
      return
    }
    const $image = imageRef.current

    if ($image) {
      zoomer_.attach($image)

      return () => {
        zoomer_.detach($image)
      }
    }
  }, [zoom, zoomer_, imageLoadStatus])

  return (
    <figure>
      <span className="relative flex justify-center" data-hide-print>
        <LazyLoad placeholder={placeholder} offset={30}>
          <span>
            {imageLoadStatus !== ImageLoadStatus.Loaded && placeholder}
          </span>

          {imageLoadStatus === ImageLoadStatus.Error && (
            <div className="absolute inset-0 z-[1] flex flex-col gap-8 center">
              <i className="icon-[mingcute--close-line] text-4xl text-red-500" />
              <span>图片加载失败</span>

              <Divider className="w-[80px] opacity-80" />
              <a href={src} target="_blank" rel="noreferrer">
                <span>查看原图</span>
              </a>
            </div>
          )}
          <OptimizedImage
            src={src}
            title={title}
            alt={alt || title || ''}
            ref={imageRef}
            onLoad={() => {
              setImageLoadStatusSafe(ImageLoadStatus.Loaded)
            }}
            onError={() => setImageLoadStatusSafe(ImageLoadStatus.Error)}
            className={styles({
              status: imageLoadStatus,
              className: imageStyles[ImageLoadStatus.Loaded],
            })}
            onAnimationEnd={(e) => {
              if (ImageLoadStatus.Loaded) {
                ;(e.target as HTMLElement).classList.remove(
                  imageStyles[ImageLoadStatus.Loaded],
                )
              }
            }}
          />
        </LazyLoad>
      </span>

      <img
        className="max-w-1/3 hidden print:block"
        src={src}
        alt={alt || title}
      />

      {!!figcaption && (
        <figcaption className="mt-1 flex flex-col items-center justify-center">
          <Divider className="w-[80px] opacity-80" />
          <span>{figcaption}</span>
        </figcaption>
      )}
    </figure>
  )
}

interface FixedImageProps extends TImageProps {
  containerWidth: number

  height?: number
  width?: number
}
export const FixedZoomedImage: Component<FixedImageProps> = (props) => {
  const placeholder = useMemo(() => {
    return <Placeholder containerWidth={props.containerWidth} src={props.src} />
  }, [props.containerWidth, props.src])
  return <ImageLazy zoom placeholder={placeholder} {...props} />
}

const Placeholder: FC<
  Pick<FixedImageProps, 'src' | 'containerWidth' | 'height' | 'width'>
> = ({ src, containerWidth, height: manualHeight, width: manualWidth }) => {
  const imageMeta = useMarkdownImageRecord(src)

  const scaledSize = useMemo(() => {
    let nextHeight = manualHeight
    let nextWidth = manualWidth

    if (!nextHeight || !nextWidth) {
      if (!imageMeta) {
        return
      }
      nextHeight = imageMeta.height
      nextWidth = imageMeta.width
    }

    if (containerWidth <= 0) return
    const { height: scaleHeight, width: scaleWidth } = calculateDimensions({
      width: nextWidth,
      height: nextHeight,
      max: {
        width: containerWidth,
        height: Infinity,
      },
    })

    return {
      scaleHeight,
      scaleWidth,
    }
  }, [manualHeight, manualWidth, containerWidth, imageMeta])

  if (!scaledSize) return <NoFixedPlaceholder accent={imageMeta?.accent} />

  return (
    <span
      className={`image-placeholder ${styles.base}`}
      data-width={scaledSize.scaleWidth}
      data-height={scaledSize.scaleHeight}
      data-from-record-height={imageMeta?.height}
      data-from-record-width={imageMeta?.width}
      data-src={src}
      style={{
        height: scaledSize.scaleHeight,
        width: scaledSize.scaleWidth,
        backgroundColor: imageMeta?.accent,
      }}
    />
  )
}

const NoFixedPlaceholder = ({ accent }: { accent?: string }) => {
  return (
    <span
      className={clsxm(
        'image-placeholder',
        styles.base,
        'h-[300px] w-full bg-slate-300 dark:bg-slate-700',
      )}
      style={{
        backgroundColor: accent,
        outline: isDev ? '4px solid red' : undefined,
      }}
    />
  )
}

// @ts-expect-error
const OptimizedImage: FC<React.JSX.IntrinsicElements['img']> = forwardRef(
  (
    {
      src,
      alt,
      placeholder,

      ...rest
    },
    ref,
  ) => {
    const { height, width } = useMarkdownImageRecord(src!) || {}
    if (!height || !width)
      return <img alt={alt} src={src} ref={ref} {...rest} />
    return (
      <Image
        alt={alt || ''}
        fetchPriority="high"
        priority
        src={src!}
        {...rest}
        height={height}
        width={width}
        ref={ref as any}
      />
    )
  },
)

OptimizedImage.displayName = 'OptimizedImage'
