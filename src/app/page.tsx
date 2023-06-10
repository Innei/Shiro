'use client'

import { useAggregation } from '~/queries/hooks/useAggregation'

export default function Home() {
  const { data } = useAggregation()
  return <main>{data!.user.avatar}</main>
}
