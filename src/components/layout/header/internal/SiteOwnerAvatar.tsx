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
        'overflow-hidden rounded-full border-[1.5px] border-accent/50',
        className,
      )}
    >
      <Image
        src={avatar}
        alt=""
        width={25}
        height={25}
        className="rounded-full border-[1.5px] border-base-100"
      />
    </div>
  )
}
