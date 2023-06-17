'use client'

import { useCallback, useState } from 'react'
import { tv } from 'tailwind-variants'
import type { ReactNode } from 'react'

import { LazyLoad } from '~/components/common/Lazyload'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'

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
  base: '',
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
  accent,
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
  return (
    <LazyLoad placeholder={placeholder}>
      <figure>
        <img
          src={src}
          title={title}
          alt={alt}
          onLoad={() => setImageLoadStatusSafe(ImageLoadStatus.Loaded)}
          onError={() => setImageLoadStatusSafe(ImageLoadStatus.Error)}
          className={styles({
            status: imageLoadStatus,
          })}
        />
        <figcaption className="mt-1 flex flex-col items-center justify-center">
          <Divider className="w-[80px] opacity-80" />
          <span>{figcaption}</span>
        </figcaption>
      </figure>
    </LazyLoad>
  )
}

export const ZoomedImage: Component<TImageProps> = (props) => {
  console.log(props)
  return (
    <span className="block text-center">
      <ImageLazy {...props} zoom />
    </span>
  )
}
