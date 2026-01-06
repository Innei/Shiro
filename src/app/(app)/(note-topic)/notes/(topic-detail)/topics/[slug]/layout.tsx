import { dehydrate } from '@tanstack/react-query'
import type { Metadata } from 'next'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { NormalContainer } from '~/components/layout/container/Normal'
import { attachServerFetch } from '~/lib/attach-fetch'
import { isShallowEqualArray } from '~/lib/lodash'
import { getQueryClient } from '~/lib/query-client.server'
import { definePrerenderPage } from '~/lib/request.server'

import { getTopicQuery } from './query'

export const dynamic = 'force-dynamic'
export const generateMetadata = async (
  props: NextPageParams<{
    slug: string
  }>,
) => {
  await attachServerFetch()
  const queryClient = getQueryClient()

  const params = await props.params
  const query = getTopicQuery(params.slug)

  const data = await queryClient.fetchQuery(query)

  return {
    title: `专栏 · ${data.name}`,
  } satisfies Metadata
}

export default definePrerenderPage<{ slug: string }>()({
  fetcher: async ({ slug }) => {
    const queryClient = getQueryClient()
    const query = getTopicQuery(slug)

    await queryClient.fetchQuery(query)
  },

  Component: async ({ children, params }) => {
    const queryClient = getQueryClient()
    const query = getTopicQuery(params.slug)
    const { queryKey } = query

    return (
      <QueryHydrate
        state={dehydrate(queryClient, {
          shouldDehydrateQuery: (query) => {
            return isShallowEqualArray(query.queryKey as any, queryKey)
          },
        })}
      >
        <NormalContainer>{children}</NormalContainer>
      </QueryHydrate>
    )
  },
})
