'use client'

import clsx from 'clsx'
import EXIF from 'exif-js'
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
  SVGProps,
} from 'react'
import {
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Blurhash } from 'react-blurhash'
import { tv } from 'tailwind-variants'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { LazyLoad } from '~/components/common/Lazyload'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { isDev, isServerSide } from '~/lib/env'
import { clsxm } from '~/lib/helper'
import { calculateDimensions } from '~/lib/image'
import { useMarkdownImageRecord } from '~/providers/article/MarkdownImageRecordProvider'

import { Divider } from '../divider'
import imageStyles from './ZoomedImage.module.css'

function TablerAperture(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE */}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m.6 3h10.55M6.551 4.938l3.26 10.034m7.221-10.336l-8.535 6.201m12.062 3.673l-8.535-6.201m.233 12.607l3.261-10.034"
      />
    </svg>
  )
}

function CarbonIsoOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...props}
    >
      {/* Icon from Carbon by IBM - undefined */}
      <path
        fill="currentColor"
        d="M24 21h-3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2m-3-8v6h3v-6zm-6 8h-5v-2h5v-2h-3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h5v2h-5v2h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2M6 11h2v10H6z"
      />
      <path
        fill="currentColor"
        d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2M4 24V8h24v16Z"
      />
    </svg>
  )
}

function MaterialSymbolsShutterSpeed(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill="currentColor"
        d="M9 3V1h6v2zm3 19q-1.875 0-3.512-.712T5.625 19.35T3.7 16.487T3 13t.713-3.488T5.65 6.65t2.863-1.937T12 4q1.575 0 3 .525T17.6 6l1.45-1.45l1.4 1.4l-1.4 1.45q.9 1.175 1.425 2.6T21 13q0 1.85-.7 3.488t-1.925 2.862t-2.863 1.938T12 22m0-2q2.925 0 4.963-2.037T19 13t-2.037-4.962T12 6T7.038 8.038T5 13t2.038 4.963T12 20m0-9h5.65q-.45-1.275-1.4-2.238T14.1 7.375zm-1.725 1L13.1 7.1q-1.275-.25-2.562.075t-2.363 1.2zM6.1 14h4.175L7.45 9.1q-.875.975-1.225 2.263T6.1 14m3.8 4.625L12 15H6.35q.425 1.25 1.388 2.225t2.162 1.4m1 .275q1.425.275 2.725-.112t2.2-1.163L13.725 14zm5.65-2q.9-1.025 1.238-2.287T17.9 12h-4.175z"
      />
    </svg>
  )
}

function StreamlineImageAccessoriesLensesPhotosCameraShutterPicturePhotographyPicturesPhotoLens(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      {/* Icon from Streamline by Streamline - https://creativecommons.org/licenses/by/4.0/ */}
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="7" cy="7" r="6.5" />
        <circle cx="7" cy="7" r="2.5" />
        <path d="M4.5 7V1M7 4.5h6M9.5 7v6M7 9.5H1" />
      </g>
    </svg>
  )
}

export function MaterialSymbolsExposure(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill="currentColor"
        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5zm9.5-1v-2h-2v-1.5h2v-2H16v2h2V16h-2v2zM6 8.5h5V7H6z"
      />
    </svg>
  )
}
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

  onClick?: () => void
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

export const ImageLazy: Component<
  TImageProps &
    BaseImageProps & {
      ref?: React.RefObject<HTMLImageElement | null>
    }
> = ({
  alt,
  src,
  title,
  zoom,

  placeholder,
  height,
  width,
  className,
  onClick,

  ref,
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
  useImperativeHandle(ref, () => imageRef.current!)
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

    if (onClick) return
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
  }, [zoom, zoomer_, imageLoadStatus, isMobile, onClick])

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
      <span
        className="group/image relative flex justify-center overflow-hidden"
        data-hide-print
      >
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
            onClick={onClick}
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

      <img className="!hidden print:!block" src={src} alt={alt || title} />

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

  onClick?: () => void
}
export const FixedZoomedImage: Component<
  FixedImageProps & {
    ref?: React.RefObject<HTMLImageElement | null>
  }
> = ({ ref, ...props }) => {
  const placeholder = useMemo(() => <Placeholder {...props} />, [props])
  return <ImageLazy zoom placeholder={placeholder} {...props} ref={ref} />
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
      className={`image-placeholder relative ${styles.base}`}
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
    >
      {imageMeta?.blurHash && (
        <Blurhash
          resolutionX={32}
          resolutionY={32}
          punch={1}
          height={scaledSize.scaleHeight}
          width={scaledSize.scaleWidth}
          hash={imageMeta.blurHash}
        />
      )}
    </span>
  )
}

const NoFixedPlaceholder = ({ accent }: { accent?: string }) => (
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

type ExifData = {
  dateTime?: string
  aperture?: string
  iso?: number
  exposureTime?: string
  device?: string
  focalLength?: string
  equivalent35mmFocalLength?: string
  exposureCompensation?: string
}

const OptimizedImage = memo(
  ({
    ref,
    src,
    alt,
    onClick,
    ...rest
  }: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > & { ref?: React.RefObject<HTMLImageElement | null> }) => {
    const { height, width } = useMarkdownImageRecord(src!) || rest

    const isGif = src!.endsWith('.gif')
    const useOptimize = !!(height && width) && !isGif

    const placeholderImageRef = useRef<HTMLImageElement>(null)
    const ImageEl = (
      <img
        onClick={onClick}
        data-zoom-src={src}
        alt={alt}
        src={src}
        ref={placeholderImageRef}
        {...rest}
      />
    )

    useImperativeHandle(ref, () => placeholderImageRef.current!)

    const optimizedImageRef = useRef<HTMLImageElement>(null)
    const [exifData, setExifData] = useState<ExifData | null>(null)

    useIsomorphicLayoutEffect(() => {
      const $renderImage = optimizedImageRef.current
      if (!$renderImage) return
      if (!placeholderImageRef.current) return
      placeholderImageRef.current.src = $renderImage.src
    }, [src])

    // Extract EXIF data from image
    useEffect(() => {
      const extractExif = async () => {
        // Create a new image element to load the image and extract EXIF
        const img = new window.Image()
        img.src = src!

        img.onload = () => {
          try {
            EXIF.getData(img as any, function (this: any) {
              const exposureTime = EXIF.getTag(this, 'ExposureTime')

              const exifData: ExifData = {
                dateTime: EXIF.getTag(this, 'DateTime'),
                aperture: EXIF.getTag(this, 'FNumber')
                  ? `f/${EXIF.getTag(this, 'FNumber').numerator / EXIF.getTag(this, 'FNumber').denominator}`
                  : undefined,
                iso: EXIF.getTag(this, 'ISOSpeedRatings'),
                exposureTime:
                  exposureTime?.numerator && exposureTime?.denominator
                    ? `${exposureTime.numerator}/${exposureTime.denominator}`
                    : undefined,

                // Add focal length extraction
                focalLength: (() => {
                  const focalLength = EXIF.getTag(this, 'FocalLength')
                  if (focalLength?.numerator && focalLength?.denominator) {
                    return `${Math.round(focalLength.numerator / focalLength.denominator)}mm`
                  }
                  return
                })(),

                // Add 35mm equivalent focal length extraction
                equivalent35mmFocalLength: (() => {
                  // Try to get FocalLengthIn35mmFilm tag first (most accurate)
                  const focalLength35mm = EXIF.getTag(
                    this,
                    'FocalLengthIn35mmFilm',
                  )
                  if (focalLength35mm) {
                    return `${focalLength35mm}mm (等效)`
                  }

                  return
                })(),

                // Add exposure compensation extraction
                exposureCompensation: (() => {
                  const exposureComp = EXIF.getTag(this, 'ExposureBias')

                  if (typeof exposureComp === 'number' && exposureComp !== 0) {
                    return exposureComp.toString()
                  }
                })(),

                device: (() => {
                  const make = EXIF.getTag(this, 'Make')
                  const model = EXIF.getTag(this, 'Model')
                  if (make && model) {
                    return `${make} ${model}`
                  } else if (make) {
                    return make
                  } else if (model) {
                    return model
                  }
                  return
                })(),
              }

              // Only set exif data if at least one field is available
              if (
                exifData.dateTime ||
                exifData.aperture ||
                exifData.device ||
                exifData.focalLength ||
                exifData.equivalent35mmFocalLength ||
                exifData.exposureCompensation
              ) {
                setExifData(exifData)
              }
            })
          } catch (error) {
            console.error('Failed to extract EXIF data:', error)
          }
        }
      }

      extractExif()
    }, [src, isGif])

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
          <>{ImageEl}</>
        )}

        {exifData && (
          <div className="not-prose absolute inset-x-0 bottom-0 translate-y-full rounded-b-xl bg-gradient-to-b from-black/30 to-black/60 p-4 font-sans opacity-0 backdrop-blur-[70px] transition-all duration-300 group-hover/image:translate-y-0 group-hover/image:opacity-100">
            <div className="flex flex-wrap justify-center gap-2">
              {exifData.device && (
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <i className="i-mingcute-camera-line text-white/80" />
                  <span className="text-sm font-medium tracking-wide text-white/90">
                    {exifData.device}
                  </span>
                </div>
              )}
              {exifData.aperture && (
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <TablerAperture className="size-4" />
                  <span className="text-sm font-medium tracking-wide text-white/90">
                    {exifData.aperture}
                  </span>
                </div>
              )}
              {exifData.iso && (
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <CarbonIsoOutline className="size-4" />
                  <span className="text-sm font-medium tracking-wide text-white/90">
                    ISO {exifData.iso}
                  </span>
                </div>
              )}
              {exifData.exposureTime && (
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <MaterialSymbolsShutterSpeed className="size-4" />
                  <span className="text-sm font-medium tracking-wide text-white/90">
                    {exifData.exposureTime}s
                  </span>
                </div>
              )}
              {exifData.equivalent35mmFocalLength ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <StreamlineImageAccessoriesLensesPhotosCameraShutterPicturePhotographyPicturesPhotoLens className="size-4" />
                  <span className="text-sm font-medium tracking-wide text-white/90">
                    {exifData.equivalent35mmFocalLength}
                  </span>
                </div>
              ) : (
                exifData.focalLength && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5">
                    <StreamlineImageAccessoriesLensesPhotosCameraShutterPicturePhotographyPicturesPhotoLens className="size-4" />
                    <span className="text-sm font-medium tracking-wide text-white/90">
                      {exifData.focalLength}
                    </span>
                  </div>
                )
              )}
              {exifData.exposureCompensation && (
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <MaterialSymbolsExposure className="size-4" />
                  <span className="text-sm font-medium tracking-wide text-white/90">
                    {exifData.exposureCompensation} EV
                  </span>
                </div>
              )}
              {exifData.dateTime && (
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <i className="i-mingcute-time-line text-white/80" />
                  <span className="text-sm font-medium tracking-wide text-white/90">
                    {exifData.dateTime.replaceAll(':', '-').slice(0, 10)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  },
)

OptimizedImage.displayName = 'OptimizedImage'
