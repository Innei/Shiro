'use client'

import Image from 'next/image'

import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'
import { clsxm } from '~/utils/helper'

export const SiteOwnerAvatar: Component = ({ className }) => {
  const avatar = useAggregationSelector((data) => data.user.avatar)

  if (!avatar) return
  return (
    <div
      className={clsxm(
        'overflow-hidden rounded-md border-[1.5px] border-slate-300 dark:border-neutral-800',
        className,
      )}
    >
      <Image src={avatar} alt="Site Owner Avatar" width={25} height={25} />
    </div>
  )
}
