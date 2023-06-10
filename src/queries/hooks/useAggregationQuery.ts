import { useQuery } from '@tanstack/react-query'

import { aggregation } from '../definition/aggregation'

export const useAggregationQuery = () => {
  return useQuery(aggregation.root())
}
