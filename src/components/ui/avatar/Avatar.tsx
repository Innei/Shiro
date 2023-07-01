import React, { createElement, useRef, useState } from 'react'
import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react'

import { clsxm } from '~/lib/helper'

import { FlexText } from '../text'

interface AvatarProps {
  url?: string
  imageUrl?: string
  size?: number

  wrapperProps?: JSX.IntrinsicElements['div']

  shadow?: boolean
  text?: string

  lazy?: boolean
}

export const Avatar: FC<
  AvatarProps &
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = (props) => {
  const {
    shadow = true,
    lazy = true,
    wrapperProps = {},
    size,
    imageUrl,
    text,
    url,
    ...imageProps
  } = props
  const avatarRef = useRef<HTMLDivElement>(null)

  const [loaded, setLoaded] = useState(!lazy)

  const { className, ...restProps } = wrapperProps

  return (
    <div
      className={clsxm(
        'box-border backface-hidden',
        shadow && 'shadow-sm',
        className,
      )}
      ref={avatarRef}
      style={
        size
          ? { height: `${size || 80}px`, width: `${size || 80}px` }
          : undefined
      }
      {...restProps}
    >
      {createElement(
        url ? 'a' : 'div',
        {
          className: 'relative inline-block h-full w-full',

          ...(url
            ? {
                href: url,
                target: '_blank',
                rel: 'noreferrer',
              }
            : {}),
        },
        imageUrl ? (
          <div
            className={clsxm(
              'h-full w-full bg-cover bg-center bg-no-repeat transition-opacity duration-300',
              className,
            )}
            style={{ opacity: loaded ? 1 : 0 }}
          >
            <img
              src={imageUrl}
              height={size}
              width={size}
              onLoad={() => setLoaded(true)}
              loading={lazy ? 'lazy' : 'eager'}
              {...imageProps}
              className={clsxm(
                'aspect-square rounded-full',
                imageProps.className,
              )}
            />
          </div>
        ) : text ? (
          <div className="relative flex h-full w-full flex-grow items-center justify-center">
            <FlexText scale={0.8} text={text} />
          </div>
        ) : null,
      )}
    </div>
  )
}
