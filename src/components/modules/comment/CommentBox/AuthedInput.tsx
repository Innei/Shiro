'use client'

import { useEffect } from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import { useUser } from '@clerk/nextjs'

import { CommentBoxActionBar } from './ActionBar'
import { CommentBoxAuthedInputSkeleton } from './AuthedInputSkeleton'
import { useSetCommentBoxValues } from './hooks'
import { UniversalTextArea } from './UniversalTextArea'

export const CommentBoxAuthedInput = () => {
  const { user } = useUser()
  const setter = useSetCommentBoxValues()
  const displayName = user
    ? user.fullName || user.lastName || user.firstName || 'Anonymous'
    : ''

  useEffect(() => {
    if (!user) return
    setter('author', displayName)
    setter('avatar', user.imageUrl)
    setter('mail', user.primaryEmailAddress?.emailAddress || '')

    const strategy = user.primaryEmailAddress?.verification.strategy

    strategy && setter('source', strategy)
  }, [displayName, setter, user])

  if (!user) return <CommentBoxAuthedInputSkeleton />
  return (
    <div className="flex space-x-4">
      <div
        className={clsx(
          'mb-2 flex-shrink-0 select-none self-end overflow-hidden rounded-full',
          'dark:ring-zinc-800" bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800',
          'ml-[2px] backface-hidden',
        )}
      >
        <Image
          className="rounded-full object-cover"
          src={user.imageUrl}
          alt={`${displayName}'s avatar`}
          width={48}
          height={48}
        />
      </div>
      <div className="relative h-[150px] w-full rounded-lg bg-gray-200/50 pb-5 dark:bg-zinc-800/50">
        <UniversalTextArea />
      </div>

      <CommentBoxActionBar className="absolute bottom-0 left-12 right-0 mb-2 ml-4 w-auto px-4" />
    </div>
  )
}
