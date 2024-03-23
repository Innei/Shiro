import { isServer } from '@tanstack/react-query'
import type { AggregateRoot } from '@mx-space/api-client'

import { apiClient } from '~/lib/request.new'

import { defineQuery } from '../helper'

export const aggregation = {
  root: () =>
    defineQuery({
      queryKey: ['aggregation'],
      queryFn: async () =>
        apiClient.aggregate.getAggregateData('shiro').then(
          (res) =>
            res.$serialized as AggregateRoot & {
              theme: AppThemeConfig
            },
        ),
      gcTime: 1000 * 60 * 10,
      meta: {
        forceHydration: true,
      },
      staleTime: isServer ? 1000 * 60 * 10 : undefined,
    }),
}
