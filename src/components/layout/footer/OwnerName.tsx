'use client'

import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const OwnerName = () => {
  const ownerName = useAggregationSelector((state) => state.user.name)

  return ownerName
}
