import { useQuery } from '@tanstack/react-query'
import type { AggregateRoot } from '@mx-space/api-client'
import type { UseQueryOptions } from '@tanstack/react-query'

import { aggregation } from '../../queries/definition/aggregation'

export const useAggregationQuery = (
  options?: UseQueryOptions<AggregateRoot, unknown, AggregateRoot, string[]>,
) => {
  return useQuery({
    ...aggregation.root(),
    ...options,
  })
}
