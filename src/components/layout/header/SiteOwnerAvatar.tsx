'use client'

import Image from 'next/image'

import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const SiteOwnerAvatar = () => {
  const avatar = useAggregationSelector((data) => data.user.avatar)

  if (!avatar) return
  return (
    <div className="absolute bottom-[8px] right-[-5px] overflow-hidden rounded-full border-[1.5px] border-accent/50">
      <Image
        src={avatar}
        alt=""
        width={25}
        height={25}
        className="rounded-full border-[1.5px] border-transparent"
      />
    </div>
  )
}
