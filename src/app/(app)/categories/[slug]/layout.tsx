import { dehydrate } from '@tanstack/react-query'
import type { Metadata } from 'next'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { NormalContainer } from '~/components/layout/container/Normal'
import { attachUAAndRealIp } from '~/lib/attach-ua.new'
import { isShallowEqualArray } from '~/lib/lodash'
import { getQueryClient } from '~/lib/query-client.server'

import { getPageBySlugQuery } from './query'

const getData = async (params: { slug: string }) => {
  attachUAAndRealIp()
  const data = await getQueryClient().fetchQuery(
    getPageBySlugQuery(params.slug),
  )
  return data
}
export const generateMetadata = async (
  props: NextPageParams<{
    slug: string
  }>,
) => {
  const data = await getData(props.params)

  return {
    title: `分类 · ${data.name}`,
  } satisfies Metadata
}
export default async function Layout(
  props: NextPageParams<{
    slug: string
  }>,
) {
  const queryClient = getQueryClient()
  const query = getPageBySlugQuery(props.params.slug)
  const queryKey = query.queryKey
  await queryClient.fetchQuery(query)

  await getData(props.params)

  return (
    <QueryHydrate
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => {
          return isShallowEqualArray(query.queryKey as any, queryKey)
        },
      })}
    >
      <NormalContainer>{props.children}</NormalContainer>
    </QueryHydrate>
  )
}
