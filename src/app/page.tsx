'use client'

import { useAggregationQuery } from '~/hooks/data/use-aggregation'

export default function Home() {
  const { data } = useAggregationQuery()
  // throw new Error()
  return <main>{data?.user.avatar}</main>
}
