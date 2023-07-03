'use client'

import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import Image from 'next/image'

import { appConfig } from '~/app.config'
import { clsxm } from '~/lib/helper'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const SiteOwnerAvatar: Component = ({ className }) => {
  const avatar = useAggregationSelector((data) => data.user.avatar)

  const { data: isLiving } = useQuery({
    queryKey: ['live-check'],
    queryFn: () =>
      fetch('/api/bilibili/live_check')
        .then((res) => res.json())
        .catch(() => null),
    select: useCallback((data: any) => {
      return !!data
    }, []),
    refetchInterval: 1000 * 60,
  })

  const handleGoLive = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    window.open(`https://live.bilibili.com/${appConfig.module.bilibili.liveId}`)
  }, [])
  if (!avatar) return
  return (
    <div
      role={isLiving ? 'button' : 'img'}
      aria-hidden
      onClick={handleGoLive}
      tabIndex={isLiving ? 0 : -1}
      className={clsxm(
        'overflow pointer-events-none relative select-none',

        isLiving ? 'cursor-pointer rounded-full' : '',
        className,
      )}
    >
      <Image
        src={avatar}
        alt="Site Owner Avatar"
        width={40}
        height={40}
        className={clsxm(
          'rounded-md ring-2 ring-slate-200 dark:ring-neutral-800',
          isLiving ? 'rounded-full' : '',
        )}
      />
      {isLiving && (
        <>
          <p className="absolute bottom-0 right-0 z-[1] rounded-md bg-red-400 p-1 font-[system-ui] text-[8px] dark:bg-orange-700">
            LIVE
          </p>

          <div className="absolute inset-0 scale-100 animate-ping rounded-full ring-2 ring-red-500/80" />
        </>
      )}
    </div>
  )
}
