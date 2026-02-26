import type { AggregateRoot } from '@mx-space/api-client'
import { simpleCamelcaseKeys } from '@mx-space/api-client'
import { $fetch } from 'ofetch'

import { defaultThemeConfig } from '~/app.default.theme-config'
import { appStaticConfig } from '~/app.static.config'
import { attachServerFetch } from '~/lib/attach-fetch'
import { deepMerge } from '~/lib/lodash'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'

const cacheTime = appStaticConfig.cache.enabled
  ? appStaticConfig.cache.ttl.aggregation
  : 1
export const fetchAggregationData = async () => {
  await attachServerFetch()
  const queryClient = getQueryClient()
  const fetcher = async () => {
    const data = (await $fetch<
      AggregateRoot & {
        theme: AppThemeConfig
      }
    >(apiClient.aggregate.proxy.toString(true), {
      params: {
        theme: 'shiro',
      },
    }).then(simpleCamelcaseKeys)) as AggregateRoot & {
      theme: AppThemeConfig
    }

    return {
      ...data,
      theme: data.theme
        ? deepMerge(defaultThemeConfig, data.theme)
        : defaultThemeConfig,
    }
  }

  return queryClient.fetchQuery({
    queryKey: ['aggregate', 'shiro'],
    queryFn: fetcher,
    staleTime: cacheTime,
    gcTime: cacheTime,
  })
}
