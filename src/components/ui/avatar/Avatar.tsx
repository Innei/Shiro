import React, { createElement, useRef, useState } from 'react'
import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react'

import { clsxm } from '~/utils/helper'

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
  const { shadow = true, lazy = true } = props
  const avatarRef = useRef<HTMLDivElement>(null)

  const [loaded, setLoaded] = useState(!lazy)

  const { wrapperProps = {} } = props
  const { className, ...restProps } = wrapperProps

  return (
    <div
      className={clsxm(
        'box-border overflow-hidden rounded-full backface-hidden',
        shadow && 'shadow-sm',
        className,
      )}
      ref={avatarRef}
      style={
        props.size
          ? { height: `${props.size || 80}px`, width: `${props.size || 80}px` }
          : undefined
      }
      {...restProps}
    >
      {createElement(
        props.url ? 'a' : 'div',
        {
          className: 'relative inline-block h-full w-full',

          ...(props.url
            ? {
                href: props.url,
                target: '_blank',
                rel: 'noreferrer',
              }
            : {}),
        },
        props.imageUrl ? (
          <div
            className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat transition-opacity duration-300"
            style={{ opacity: loaded ? 1 : 0 }}
          >
            <img
              src={props.imageUrl}
              height={props.size}
              width={props.size}
              onLoad={() => setLoaded(true)}
              loading={lazy ? 'lazy' : 'eager'}
              className="aspect-square"
            />
          </div>
        ) : props.text ? (
          <div className="relative flex h-full w-full flex-grow items-center justify-center">
            <FlexText scale={0.8} text={props.text} />
          </div>
        ) : null,
      )}
    </div>
  )
}
