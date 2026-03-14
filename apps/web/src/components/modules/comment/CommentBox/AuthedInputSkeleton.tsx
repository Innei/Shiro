'use client'

import clsx from 'clsx'

export const CommentBoxAuthedInputSkeleton = () => {
  const color = 'bg-neutral-200/50 dark:bg-neutral-800/50'
  return (
    <div className="flex animate-pulse gap-4">
      <div
        className={clsx('size-12 self-end overflow-hidden rounded-full', color)}
      />
      <div className={clsx('h-[150px] w-full rounded-lg', color)} />
    </div>
  )
}
