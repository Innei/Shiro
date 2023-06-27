'use client'

import { useRef } from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import { useUser } from '@clerk/nextjs'

import { CommentAuthedInputSkeleton } from './CommentAuthedInputSkeleton'
import { CommentBoxActionBar } from './CommentBoxActionBar'
import {
  useCommentBoxTextValue,
  useSetCommentBoxValues,
} from './CommentBoxProvider'
import { getRandomPlaceholder } from './constants'

export const CommentAuthedInput = () => {
  const { user } = useUser()

  const TextArea = useRef(function Textarea() {
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
          'h-full w-full rounded-lg text-neutral-900/80 dark:text-slate-100/80',
          'overflow-auto bg-gray-200/50 px-3 py-4 dark:bg-zinc-800/50',
        )}
      />
    )
  }).current

  if (!user) return <CommentAuthedInputSkeleton />
  return (
    <div className="flex space-x-4">
      <div
        className={clsx(
          'mb-2 ml-2 h-12 w-12 flex-shrink-0 select-none self-end overflow-hidden rounded-full',
          'dark:ring-zinc-800" bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800',
          'backface-hidden',
        )}
      >
        <Image
          className="rounded-full object-cover"
          src={user.profileImageUrl}
          alt={`${user.lastName}'s avatar`}
          width={48}
          height={48}
        />
      </div>
      <div className="relative h-[150px] w-full">
        <TextArea />
      </div>

      <CommentBoxActionBar className="absolute bottom-0 left-12 right-0 ml-4" />
    </div>
  )
}
