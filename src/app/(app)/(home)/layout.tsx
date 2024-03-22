import { dehydrate } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { isShallowEqualArray } from '~/lib/lodash'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request.new'
import { requestErrorHandler } from '~/lib/request.server'

import { queryKey } from './query'

export const revalidate = 3600

export default async function HomeLayout(props: PropsWithChildren) {
  const queryClient = getQueryClient()
  await queryClient
    .fetchQuery({
      queryKey,
      queryFn: async () => {
        return (await apiClient.aggregate.getTop(5)).$serialized
      },
    })
    .catch(requestErrorHandler)

  const dehydrateState = dehydrate(queryClient, {
    shouldDehydrateQuery(query) {
      return isShallowEqualArray(query.queryKey as any, queryKey)
    },
  })
  return <QueryHydrate state={dehydrateState}>{props.children}</QueryHydrate>
}
