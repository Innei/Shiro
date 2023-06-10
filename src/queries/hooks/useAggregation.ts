import { useQuery } from '@tanstack/react-query'

import { aggregation } from '../definition/aggregation'

export const useAggregation = () => {
  return useQuery(aggregation.root())
}
