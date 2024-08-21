'use client'

import clsx from 'clsx'

import { useHeaderBgOpacity } from './hooks'

export const BluredBackground = () => {
  const headerOpacity = useHeaderBgOpacity()
  return (
    <div
      className={clsx(
        'absolute inset-0 transform-gpu [-webkit-backdrop-filter:saturate(180%)_blur(20px)] [backdrop-filter:saturate(180%)_blur(20px)] [backface-visibility:hidden]',
        'bg-themed-bg_opacity [border-bottom:1px_solid_rgb(187_187_187_/_20%)]',
        // "before:bg-accent/5 before:content-[''] before:absolute before:inset-0 before:z-0",
      )}
      style={{
        opacity: headerOpacity,
      }}
    />
  )
}
