'use client'

import { useCallback, useMemo, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { tv } from 'tailwind-variants'
import type { FC, ReactNode } from 'react'

import { LazyLoad } from '~/components/common/Lazyload'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { calculateDimensions } from '~/lib/calc-image'
import { useArticleElementSize } from '~/providers/article/article-element-provider'
import { useMarkdownImageRecord } from '~/providers/article/markdown-image-record-provider'
import { clsxm } from '~/utils/helper'

import { Divider } from '../divider'

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
            initial="loading"
            animate={controls}
            src={src}
            title={title}
            alt={alt}
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
