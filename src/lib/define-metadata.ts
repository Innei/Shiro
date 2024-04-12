import type { AggregateRoot } from '@mx-space/api-client'
import type { Metadata } from 'next'

// import { captureException } from '@sentry/nextjs'

import { getQueryClient } from '~/lib/query-client.server'
import { queries } from '~/queries/definition'

import { attachServerFetch } from './attach-fetch'

export const defineMetadata = <T extends Record<string, string>>(
  fn: (
    params: T,
    getAggregationData: () => Promise<AggregateRoot & { theme: any }>,
  ) => Promise<Partial<Metadata>>,
) => {
  const handler = async ({ params }: { params: T }): Promise<Metadata> => {
    const getData = async () => {
      const queryClient = getQueryClient()
      attachServerFetch()
      return await queryClient.fetchQuery({
        ...queries.aggregation.root(),
      })
    }
    const result = await fn(params, getData).catch((err) => {
      // captureException(err)
      return {}
    })

    return {
      ...result,
    }
  }

  return handler
}
