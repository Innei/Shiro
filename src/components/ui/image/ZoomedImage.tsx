'use client'

import clsx from 'clsx'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import type { Zoom } from 'medium-zoom'
import mediumZoom from 'medium-zoom'
import Image from 'next/image'
import type {
  AnimationEventHandler,
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  ReactNode,
} from 'react'
import {
  cloneElement,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIsMobile } from '~/atoms/hooks'
import { LazyLoad } from '~/components/common/Lazyload'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { isDev, isServerSide } from '~/lib/env'
import { clsxm } from '~/lib/helper'
import { calculateDimensions } from '~/lib/image'
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

  height?: number
  width?: number
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
  height,
  width,
  className,
}) => {
  const [zoomer_] = useState(() => {
    if (isServerSide) return null!
    if (zoomer) return zoomer
    const zoom = mediumZoom(undefined, {})
    zoomer = zoom
    return zoom
  })

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
  const isMobile = useIsMobile()
  useIsomorphicLayoutEffect(() => {
    if (imageLoadStatus !== ImageLoadStatus.Loaded) {
      return
    }
    if (!zoom) {
      return
    }
    const $image = imageRef.current

    if (!$image) return
    if (isMobile) {
      $image.onclick = () => {
        // NOTE: document 上的 click 可以用 stopImmediatePropagation 阻止
        // e.stopImmediatePropagation()
        window.open(src)
      }
      return () => {
        $image.onclick = null
      }
    }

    if ($image) {
      zoomer_.attach($image)

      return () => {
        zoomer_.detach($image)
      }
    }
  }, [zoom, zoomer_, imageLoadStatus, isMobile])

  const handleOnLoad = useCallback(() => {
    setImageLoadStatusSafe(ImageLoadStatus.Loaded)
  }, [setImageLoadStatusSafe])
  const handleError = useCallback(
    () => setImageLoadStatusSafe(ImageLoadStatus.Error),
    [setImageLoadStatusSafe],
  )
  const handleOnAnimationEnd: AnimationEventHandler<HTMLImageElement> =
    useCallback((e) => {
      if (ImageLoadStatus.Loaded) {
        ;(e.target as HTMLElement).classList.remove(
          imageStyles[ImageLoadStatus.Loaded],
        )
      }
    }, [])
  const imageClassName = useMemo(
    () =>
      styles({
        status: imageLoadStatus,
        className: clsx(imageStyles[ImageLoadStatus.Loaded], className),
      }),
    [className, imageLoadStatus],
  )
  return (
    <figure>
      <span className="relative flex justify-center" data-hide-print>
        <LazyLoad placeholder={placeholder} offset={30}>
          <span>
            {imageLoadStatus !== ImageLoadStatus.Loaded && placeholder}
          </span>
          {/* <div className="absolute top-0 opacity-30">{placeholder}</div> */}
          {imageLoadStatus === ImageLoadStatus.Error && (
            <div className="center absolute inset-0 z-[1] flex flex-col gap-8">
              <i className="i-mingcute-close-line text-4xl text-red-500" />
              <span>图片加载失败</span>

              <Divider className="w-[80px] opacity-80" />
              <a href={src} target="_blank" rel="noreferrer">
                <span>查看原图</span>
              </a>
            </div>
          )}
          <OptimizedImage
            height={height}
            width={width}
            src={src}
            title={title}
            alt={alt || title || ''}
            ref={imageRef}
            onLoad={handleOnLoad}
            onError={handleError}
            className={imageClassName}
            onAnimationEnd={handleOnAnimationEnd}
          />
        </LazyLoad>
      </span>

      <img
        className="max-w-1/3 !hidden print:!block"
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
    return <Placeholder {...props} />
  }, [props])
  return <ImageLazy zoom placeholder={placeholder} {...props} />
}

const Placeholder: FC<
  Pick<
    FixedImageProps,
    'src' | 'containerWidth' | 'height' | 'width' | 'accent'
  >
> = ({
  src,
  containerWidth,
  height: manualHeight,
  width: manualWidth,
  accent,
}) => {
  const imageMeta = useMarkdownImageRecord(src)
  const accentColor = accent || imageMeta?.accent

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

  if (!scaledSize) return <NoFixedPlaceholder accent={accentColor} />

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
        backgroundColor: accentColor,
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

const OptimizedImage = memo(
  forwardRef<
    HTMLImageElement,
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  >(({ src, alt, ...rest }, ref) => {
    const { height, width } = useMarkdownImageRecord(src!) || rest

    const isGif = src!.endsWith('.gif')
    const useOptimize = !!(height && width) && !isGif

    const placeholderImageRef = useRef<HTMLImageElement>(null)
    const ImageEl = (
      <img
        data-zoom-src={src}
        alt={alt}
        src={src}
        ref={placeholderImageRef}
        {...rest}
      />
    )

    useImperativeHandle(ref, () => placeholderImageRef.current!)

    const optimizedImageRef = useRef<HTMLImageElement>(null)

    useIsomorphicLayoutEffect(() => {
      const $renderImage = optimizedImageRef.current
      if (!$renderImage) return
      if (!placeholderImageRef.current) return
      placeholderImageRef.current.src = $renderImage.src
    }, [src])

    return (
      <>
        {useOptimize ? (
          <>
            <Image
              alt={alt || ''}
              fetchPriority="high"
              priority
              src={src!}
              {...rest}
              height={+height}
              width={+width}
              ref={optimizedImageRef}
            />
            <div className="absolute inset-0 flex justify-center opacity-0">
              {cloneElement(ImageEl, {
                src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // blank src
              })}
            </div>
          </>
        ) : (
          ImageEl
        )}
      </>
    )
  }),
)

OptimizedImage.displayName = 'OptimizedImage'
