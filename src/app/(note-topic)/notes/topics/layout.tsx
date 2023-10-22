import { dehydrate } from '@tanstack/react-query'
import type { Metadata } from 'next'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { NormalContainer } from '~/components/layout/container/Normal'
import { isShallowEqualArray } from '~/lib/_'
import { attachUAAndRealIp } from '~/lib/attach-ua'
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
          // @ts-expect-error
          return isShallowEqualArray(query.queryKey, topicsQuery.queryKey)
        },
      })}
    >
      <NormalContainer>{props.children}</NormalContainer>
    </QueryHydrate>
  )
}
