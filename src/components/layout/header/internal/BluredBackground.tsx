'use client'


import { useHeaderBgOpacity } from './hooks'
import clsx from 'clsx'

export const BluredBackground = () => {
  const headerOpacity = useHeaderBgOpacity()
  return (
    <div
      className={clsx(
        'absolute inset-0 transform-gpu [backdrop-filter:saturate(180%)_blur(20px)] [backface-visibility:hidden]',
        'bg-themed-bg_opacity [border-bottom:1px_solid_rgb(187_187_187_/_20%)]',
      )}
      style={{
        opacity: headerOpacity,
      }}
    />
  )
}
