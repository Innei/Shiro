import { dehydrate } from '@tanstack/react-query'
import type { Metadata } from 'next'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { NormalContainer } from '~/components/layout/container/Normal'
import { isShallowEqualArray } from '~/lib/_'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { getQueryClient } from '~/lib/query-client.server'

import { getTopicQuery } from './query'

export const generateMetadata = async (
  props: NextPageParams<{
    slug: string
  }>,
) => {
  attachUAAndRealIp()
  const queryClient = getQueryClient()

  const query = getTopicQuery(props.params.slug)

  const data = await queryClient.fetchQuery(query)

  return {
    title: `专栏 · ${data.name}`,
  } satisfies Metadata
}
export default async function Layout(
  props: NextPageParams<{
    slug: string
  }>,
) {
  attachUAAndRealIp()
  const queryClient = getQueryClient()
  const query = getTopicQuery(props.params.slug)
  const queryKey = query.queryKey
  await queryClient.fetchQuery(query)
  return (
    <QueryHydrate
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => {
          // @ts-expect-error
          return isShallowEqualArray(query.queryKey, queryKey)
        },
      })}
    >
      <NormalContainer>{props.children}</NormalContainer>
    </QueryHydrate>
  )
}
