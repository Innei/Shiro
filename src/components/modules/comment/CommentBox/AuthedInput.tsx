'use client'

import * as Avatar from '@radix-ui/react-avatar'
import clsx from 'clsx'
import { useEffect } from 'react'

import { useSessionReader } from '~/atoms/hooks/reader'
import { UserAuthFromIcon } from '~/components/layout/header/internal/UserAuthFromIcon'
import { getUserUrl } from '~/lib/authjs'

import { CommentBoxActionBar } from './ActionBar'
import { useSetCommentBoxValues } from './hooks'
import { UniversalTextArea } from './UniversalTextArea'

export const CommentBoxAuthedInput = () => {
  const setter = useSetCommentBoxValues()

  const reader = useSessionReader()

  const displayName = reader ? reader.name || 'Anonymous' : ''

  useEffect(() => {
    if (!reader) return
    setter('author', displayName)
    setter('avatar', reader.image)
    setter('mail', reader.email)

    reader.handle &&
      setter(
        'url',
        getUserUrl({
          provider: reader.provider,
          handle: reader.handle,
        }) || '',
      )
    setter('source', reader.provider)
  }, [displayName, reader, setter])

  if (!reader) return null

  return (
    <div className="flex space-x-4">
      <div
        className={clsx(
          'relative mb-2 shrink-0 select-none self-end rounded-full',
          'bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800',
          'backface-hidden ml-[2px]',
        )}
      >
        <Avatar.Root>
          <Avatar.Image
            className="rounded-full object-cover"
            src={reader.image}
            alt={`${displayName}'s avatar`}
            width={48}
            height={48}
          />
          <Avatar.Fallback
            delayMs={600}
            className="block size-[48px] shrink-0 rounded-full"
          />
        </Avatar.Root>

        <UserAuthFromIcon className="absolute -bottom-1 right-0" />
      </div>
      <div className="relative h-[150px] w-full rounded-xl bg-gray-200/50 dark:bg-zinc-800/50">
        <UniversalTextArea className="pb-5" />
      </div>

      <CommentBoxActionBar className="absolute bottom-0 left-14 right-0 mb-2 ml-4 w-auto px-4" />
    </div>
  )
}
