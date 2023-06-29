import clsx from 'clsx'
import Image from 'next/image'

import { useIsLogged } from '~/atoms'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { CommentBoxActionBar } from './ActionBar'
import { UniversalTextArea } from './UniversalTextArea'

export const CommentBoxLegacyForm = () => {
  const isLogger = useIsLogged()
  if (isLogger) return <LoggedForm />
  return null
}

const LoggedForm = () => {
  const user = useAggregationSelector((v) => v.user)!

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
          src={user.avatar}
          alt={`${user.name || user.username}'s avatar`}
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
