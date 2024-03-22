import { dehydrate } from '@tanstack/react-query'
import type { Metadata } from 'next'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { NormalContainer } from '~/components/layout/container/Normal'
import { attachUAAndRealIp } from '~/lib/attach-ua.new'
import { isShallowEqualArray } from '~/lib/lodash'
import { getQueryClient } from '~/lib/query-client.server'

import { topicsQuery } from './query'

export const metadata: Metadata = {
  title: '专栏',
}

export default async function Layout(
  props: NextPageParams<{
    slug: string
  }>,
) {
  attachUAAndRealIp()
  const queryClient = getQueryClient()

  await queryClient.fetchQuery(topicsQuery)
  return (
    <QueryHydrate
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => {
          return isShallowEqualArray(
            query.queryKey as any,
            topicsQuery.queryKey,
          )
        },
      })}
    >
      <NormalContainer>{props.children}</NormalContainer>
    </QueryHydrate>
  )
}
