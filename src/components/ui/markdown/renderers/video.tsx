import type { FC } from 'react'

import { clsxm } from '~/lib/helper'

import { VideoPlayer } from '../../media/VideoPlayer'

export const Video: FC<React.VideoHTMLAttributes<HTMLVideoElement>> = (
  props,
) => {
  if (!props.src) return null
  return (
    <VideoPlayer
      {...props}
      src={props.src}
      className={clsxm('mx-auto select-none', props.className)}
      playsInline
      muted
      autoPlay
    />
  )
}
