'use client'

import type { FC } from 'react'

import { clsxm } from '~/lib/helper'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

const bannerClassNames = {
  info: `bg-sky-50 dark:bg-sky-800 dark:text-white`,
  warning: `bg-orange-100 dark:bg-orange-800 dark:text-white`,
  error: `bg-rose-100 dark:bg-rose-800 dark:text-white`,
  success: `bg-emerald-100 dark:bg-emerald-800 dark:text-white`,
  secondary: `bg-sky-100 dark:bg-sky-800 dark:text-white`,
}

const useNoteBanner = () => {
  const meta = useCurrentNoteDataSelector((n) => n?.data.meta)

  let banner = meta?.banner as {
    type: string
    message: string
    className: string
    style?: any
  }

  if (!banner) {
    return
  }
  if (typeof banner === 'string') {
    return {
      type: 'info',
      message: banner,
      className: bannerClassNames.info,
    }
  }
  banner = { ...banner }
  banner.type ??= 'info'
  banner.className ??=
    bannerClassNames[banner.type as keyof typeof bannerClassNames]

  return banner
}

export const NoteRootBanner = () => {
  const banner = useNoteBanner()

  if (!banner) return null

  return (
    <div className="mx-[var(--padding-h)] mb-4 mt-8 text-sm">
      <NoteBanner {...banner} />
    </div>
  )
}

export const NoteBanner: FC<{
  style?: any
  className: string
  message: string
}> = (banner) => {
  return (
    <div
      className={clsxm('flex justify-center p-4 leading-8', banner.className)}
      style={banner.style}
    >
      {banner.message}
    </div>
  )
}
