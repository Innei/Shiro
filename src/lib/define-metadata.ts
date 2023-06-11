import { headers } from 'next/dist/client/components/headers'
import type { AggregateRoot } from '@mx-space/api-client'
import type { Metadata } from 'next'

import { captureException } from '@sentry/nextjs'

import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'
import { $axios } from '~/utils/request'

export const defineMetadata = <T extends Record<string, string>>(
  fn: (
    params: T,
    getAggregationData: () => Promise<AggregateRoot>,
  ) => Promise<Partial<Metadata>>,
) => {
  const handler = async ({ params }: { params: T }): Promise<Metadata> => {
    const getData = async () => {
      const { get } = headers()
      const queryClient = getQueryClient()
      const ua = get('user-agent')
      $axios.defaults.headers.common['User-Agent'] = ua

      return await queryClient.fetchQuery({
        ...queries.aggregation.root(),
      })
    }
    const result = await fn(params, getData).catch((err) => {
      captureException(err)
      return {}
    })

    return {
      ...result,
    }
  }

  return handler
}
