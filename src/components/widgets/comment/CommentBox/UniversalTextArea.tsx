'use client'

import { useRef } from 'react'
import clsx from 'clsx'

import { getRandomPlaceholder } from './constants'
import { useCommentBoxTextValue, useSetCommentBoxValues } from './hooks'

export const UniversalTextArea = () => {
  const placeholder = useRef(getRandomPlaceholder()).current
  const setter = useSetCommentBoxValues()
  const value = useCommentBoxTextValue()
  return (
    <textarea
      value={value}
      onChange={(e) => {
        setter('text', e.target.value)
      }}
      placeholder={placeholder}
      className={clsx(
        'h-full w-full resize-none bg-transparent',
        'overflow-auto px-3 py-4',
        'text-neutral-900/80 dark:text-slate-100/80',
      )}
    />
  )
}
