'use client'

import { useCallback, useId, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useDomEvent,
} from 'framer-motion'
import { useTheme } from 'next-themes'
import { tv } from 'tailwind-variants'
import type { FC, ReactNode } from 'react'

import { LazyLoad } from '~/components/common/Lazyload'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { calculateDimensions } from '~/lib/calc-image'
import { useArticleElementSize } from '~/providers/article/article-element-provider'
import { useMarkdownImageRecord } from '~/providers/article/markdown-image-record-provider'
import { clsxm } from '~/utils/helper'

import { Divider } from '../divider'
import { RootPortal } from '../portal'

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

export const ImageLazy: Component<TImageProps & BaseImageProps> = ({
  alt,
  src,
  title,
  zoom,

  placeholder,
}) => {
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

  const controls = useAnimationControls()
  const currentId = useId()
  const [imageZooming, setImageZooming] = useState(false)

  return (
    <LazyLoad placeholder={placeholder}>
      <figure>
        <span className="relative block">
          <span>
            {imageLoadStatus !== ImageLoadStatus.Loaded && placeholder}
          </span>
          <motion.img
            variants={{
              loading: {
                opacity: 0,
                // filter: 'blur(10px)',
              },
              loaded: {
                opacity: 1,
                // filter: 'blur(0px)',
              },
            }}
            layoutId={currentId}
            initial="loading"
            animate={controls}
            src={src}
            title={title}
            alt={alt}
            onClick={() => {
              zoom && setImageZooming(true)
            }}
            onLoad={() => {
              setImageLoadStatusSafe(ImageLoadStatus.Loaded)
              requestAnimationFrame(() => {
                controls.start('loaded')
              })
            }}
            onError={() => setImageLoadStatusSafe(ImageLoadStatus.Error)}
            className={styles({
              status: imageLoadStatus,
            })}
          />
        </span>

        <ImagePreview
          id={currentId}
          onClose={() => {
            setImageZooming(false)
          }}
          show={imageZooming}
          src={src}
          alt={alt}
        />
        {!!figcaption && (
          <figcaption className="mt-1 flex flex-col items-center justify-center">
            <Divider className="w-[80px] opacity-80" />
            <span>{figcaption}</span>
          </figcaption>
        )}
      </figure>
    </LazyLoad>
  )
}

const ImagePreview = (props: {
  src?: string
  show: boolean
  onClose: () => void
  alt?: string
  id: string
}) => {
  const isDark = useTheme().theme === 'dark'
  const { alt, show, onClose, src, id } = props
  useDomEvent(useRef(window), 'scroll', () => show && onClose())

  return (
    <RootPortal>
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-[98] flex cursor-zoom-out items-center justify-center"
            animate={{
              backgroundColor: [
                `#${isDark ? '000000' : 'ffffff'}00`,
                isDark ? '#111' : '#fff',
              ],
            }}
            exit={{
              backgroundColor: [
                isDark ? '#111' : '#fff',
                `#${isDark ? '000000' : 'ffffff'}00`,
              ],
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-[99] flex cursor-zoom-out items-center justify-center"
          onClick={() => {
            onClose()
          }}
        >
          <motion.img
            layoutId={id}
            src={src}
            alt={alt}
            className="max-h-[95%] max-w-[95%]"
          />
        </div>
      )}
    </RootPortal>
  )
}

export const ZoomedImage: Component<TImageProps> = (props) => {
  return (
    <span className="block text-center">
      <ImageLazy {...props} zoom />
    </span>
  )
}

export const FixedZoomedImage: Component<TImageProps> = (props) => {
  const placeholder = useMemo(() => {
    return <Placeholder src={props.src} />
  }, [props.src])
  return <ImageLazy zoom placeholder={placeholder} {...props} />
}

const Placeholder: FC<{
  src: string
}> = ({ src }) => {
  const { h, w } = useArticleElementSize()
  const imageMeta = useMarkdownImageRecord(src)

  const scaledSize = useMemo(() => {
    if (!h || !w) return
    if (!imageMeta) return
    const { height, width } = imageMeta
    const { height: scaleHeight, width: scaleWidth } = calculateDimensions(
      width,
      height,
      {
        width: w,
        height: Infinity,
      },
    )

    return {
      scaleHeight,
      scaleWidth,
    }
  }, [h, w, imageMeta])

  if (!scaledSize) return <NoFixedPlaceholder />
  if (h === 0 || w === 0) return <NoFixedPlaceholder />
  return (
    <span
      className={styles.base}
      style={{
        height: scaledSize.scaleHeight,
        width: scaledSize.scaleWidth,
        backgroundColor: imageMeta?.accent,
      }}
    />
  )
}

const NoFixedPlaceholder = () => {
  return (
    <span
      className={clsxm(
        styles.base,
        'h-[150px] w-full bg-slate-300 dark:bg-slate-700',
      )}
    />
  )
}
