'use client'

import { useEffect } from 'react'
import clsx from 'clsx'

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

    for (const account of user.externalAccounts) {
      if (account.provider === 'github') {
        account.username &&
          setter('url', `https://github.com/${account.username}`)
        break
      }

      if (account.provider === 'twitter') {
        account.username && setter('url', `https://x.com/${account.username}`)
        break
      }
    }

    const strategy = user.primaryEmailAddress?.verification.strategy

    strategy && setter('source', strategy)
  }, [displayName, setter, user])

  if (!user) return <CommentBoxAuthedInputSkeleton />
  return (
    <div className="flex space-x-4">
      <div
        className={clsx(
          'mb-2 shrink-0 select-none self-end overflow-hidden rounded-full',
          'dark:ring-zinc-800" bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800',
          'backface-hidden ml-[2px]',
        )}
      >
        <img
          className="rounded-full object-cover"
          src={user.imageUrl}
          alt={`${displayName}'s avatar`}
          width={48}
          height={48}
        />
      </div>
      <div className="relative h-[150px] w-full rounded-xl bg-gray-200/50 dark:bg-zinc-800/50">
        <UniversalTextArea className="pb-5" />
      </div>

      <CommentBoxActionBar className="absolute bottom-0 left-14 right-0 mb-2 ml-4 w-auto px-4" />
    </div>
  )
}
