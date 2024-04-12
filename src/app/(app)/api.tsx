import { cache } from 'react'
import { $fetch } from 'ofetch'
import type { AggregateRoot } from '@mx-space/api-client'

import { simpleCamelcaseKeys } from '@mx-space/api-client'

import { appStaticConfig } from '~/app.static.config'
import { attachServerFetch } from '~/lib/attach-fetch'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'

const cacheTime = appStaticConfig.cache.enabled
  ? appStaticConfig.cache.ttl.aggregation
  : 1
export const fetchAggregationData = cache(async () => {
  attachServerFetch()
  const queryClient = getQueryClient()
  const fetcher = async () =>
    (await $fetch<
      AggregateRoot & {
        theme: AppThemeConfig
      }
    >(apiClient.aggregate.proxy.toString(true), {
      params: {
        theme: 'shiro',
      },
      next: {
        revalidate: cacheTime,
        tags: ['aggregate', 'shiro'],
      },
    }).then(simpleCamelcaseKeys)) as AggregateRoot & {
      theme: AppThemeConfig
    }

  return queryClient.fetchQuery({
    queryKey: ['aggregate', 'shiro'],
    queryFn: fetcher,
    staleTime: cacheTime,
    gcTime: cacheTime,
  })
})
