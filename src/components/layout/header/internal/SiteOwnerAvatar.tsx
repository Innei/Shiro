'use client'

import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { clsxm } from '~/lib/helper'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

export const SiteOwnerAvatar: Component = ({ className }) => {
  const avatar = useAggregationSelector((data) => data.user.avatar)
  const liveId = useAppConfigSelector(
    (config) => config.module?.bilibili?.liveId,
  )

  const { data: isLiving } = useQuery({
    queryKey: ['live-check'],
    queryFn: () =>
      fetch(`/api/bilibili/check_live?liveId=${liveId}`, {
        next: {
          revalidate: 1,
        },
      })
        .then((res) => res.json())
        .catch(() => null),
    select: useCallback((data: any) => {
      return !!data
    }, []),
    refetchInterval: 1000 * 60,
    enabled: !!liveId,
    meta: {
      persist: false,
    },
  })

  if (!avatar) return
  return (
    <div
      role={isLiving ? 'button' : 'img'}
      className={clsxm(
        'overflow pointer-events-none relative z-[9] select-none',

        isLiving ? 'cursor-pointer rounded-full' : '',
        className,
      )}
    >
      <img
        src={avatar}
        alt="Site Owner Avatar"
        width={40}
        height={40}
        className={clsxm(
          'ring-2 ring-slate-200 dark:ring-neutral-800',
          isLiving ? 'rounded-full' : 'mask mask-squircle',
        )}
      />
      {isLiving && (
        <>
          <p className="absolute bottom-0 right-0 z-[1] rounded-md bg-red-400 p-1 font-[system-ui] text-[6px] text-white dark:bg-orange-700">
            LIVE
          </p>

          <div className="absolute inset-0 scale-100 animate-ping rounded-full ring-2 ring-red-500/80" />
        </>
      )}
    </div>
  )
}
