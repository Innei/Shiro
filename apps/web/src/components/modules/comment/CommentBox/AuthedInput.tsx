'use client'

import { Avatar } from '@base-ui/react/avatar'
import clsx from 'clsx'
import { useEffect } from 'react'

import { useSessionReader } from '~/atoms/hooks/reader'
import { UserAuthFromIcon } from '~/components/layout/header/internal/UserAuthFromIcon'
import { getUserUrl } from '~/lib/authjs'

import { CommentBoxActionBar } from './ActionBar'
import { useCommentCompact, useSetCommentBoxValues } from './hooks'
import { UniversalTextArea } from './UniversalTextArea'

export const CommentBoxAuthedInput: Component<{ autoFocus?: boolean }> = ({
  autoFocus,
}) => {
  const setter = useSetCommentBoxValues()
  const compact = useCommentCompact()

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

  if (compact) {
    return (
      <div className="flex gap-2.5">
        <div className="shrink-0 self-end mb-1">
          <Avatar.Root>
            <Avatar.Image
              alt={`${displayName}'s avatar`}
              className="rounded-full object-cover"
              height={28}
              src={reader.image}
              width={28}
            />
            <Avatar.Fallback
              className="block size-7 shrink-0 rounded-full"
              delay={600}
            />
          </Avatar.Root>
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="relative h-[88px] w-full rounded-lg bg-neutral-100/80 dark:bg-neutral-800/40">
            <UniversalTextArea autoFocus={autoFocus} className="pb-7" />
          </div>
          <CommentBoxActionBar className="absolute bottom-0 left-0 right-0 mb-1.5 w-auto px-3" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex space-x-4">
      <div
        className={clsx(
          'relative mb-2 shrink-0 select-none self-end rounded-full',
          'bg-neutral-200 ring-2 ring-neutral-200 dark:bg-neutral-800',
          'backface-hidden ml-[2px]',
        )}
      >
        <Avatar.Root>
          <Avatar.Image
            alt={`${displayName}'s avatar`}
            className="rounded-full object-cover"
            height={48}
            src={reader.image}
            width={48}
          />
          <Avatar.Fallback
            className="block size-[48px] shrink-0 rounded-full"
            delay={600}
          />
        </Avatar.Root>

        <UserAuthFromIcon className="absolute -bottom-1 right-0" />
      </div>
      <div className="relative h-[150px] w-full rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50">
        <UniversalTextArea autoFocus={autoFocus} className="pb-5" />
      </div>

      <CommentBoxActionBar className="absolute bottom-0 left-14 right-0 mb-2 ml-4 w-auto px-4" />
    </div>
  )
}
