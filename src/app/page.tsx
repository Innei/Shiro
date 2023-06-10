'use client'

import { useAggregationQuery } from '~/queries/hooks/useAggregationQuery'

export default function Home() {
  const { data } = useAggregationQuery()
  return <main>{data!.user.avatar}</main>
}
