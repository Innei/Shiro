'use client'

import { useAggregationQuery } from '~/hooks/data/use-aggregation'

export default function Home() {
  const { data } = useAggregationQuery()

  return null
}
