import { dehydrate } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { isShallowEqualArray } from '~/lib/_'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'

import { queryKey } from './query'

export const revalidate = 60

export default async function HomeLayout(props: PropsWithChildren) {
  const queryClient = getQueryClient()
  await queryClient.fetchQuery({
    queryKey,
    queryFn: async () => {
      return (await apiClient.aggregate.getTop(5)).$serialized
    },
  })

  const dehydrateState = dehydrate(queryClient, {
    shouldDehydrateQuery(query) {
      return isShallowEqualArray(query.queryKey as any, queryKey)
    },
  })
  return <QueryHydrate state={dehydrateState}>{props.children}</QueryHydrate>
}
