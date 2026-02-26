'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { useOwnerStatus } from '~/atoms/hooks/status'
import { clsxm } from '~/lib/helper'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { OwnerStatus } from './OwnerStatus'
import { useLiveQuery } from './useLiveQuery'

export const SiteOwnerAvatar: Component = ({ className }) => {
  const t = useTranslations('common')
  const avatar = useAggregationSelector((data) => data.user.avatar)

  const { data: isLiving } = useLiveQuery()

  const ownerStatus = useOwnerStatus()
  if (!avatar) return

  return (
    <div
      role={isLiving ? 'button' : 'img'}
      className={clsxm(
        'pointer-events-none relative z-[9] size-[40px] select-none',
        isLiving ? 'cursor-pointer rounded-full' : '',
        className,
      )}
    >
      <div
        className={clsxm(
          isLiving ? 'rounded-full' : 'mask mask-squircle',
          'overflow-hidden',
        )}
      >
        <Image
          src={avatar}
          alt={t('aria_site_owner_avatar')}
          width={40}
          height={40}
          style={
            ownerStatus
              ? {
                  maskImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDBINDBWMjcuMzQyN0MzOC4zNSAyNS4zMDM3IDM1LjgyNzMgMjQgMzMgMjRDMjguMDI5NCAyNCAyNCAyOC4wMjk0IDI0IDMzQzI0IDM1LjgyNzMgMjUuMzAzNyAzOC4zNSAyNy4zNDI3IDQwSDBWMFoiIGZpbGw9IiNEOUQ5RDkiLz4KPC9zdmc+Cg==")`,
                }
              : undefined
          }
          className="ring-2 ring-slate-200 dark:ring-neutral-800"
        />
      </div>
      {!isLiving && <OwnerStatus />}
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
