'use client'

import { useAggregation } from '~/hooks/data/use-aggregation'

export default function Home() {
  const { data } = useAggregation()
  return <main>{data?.user.avatar}</main>
}
