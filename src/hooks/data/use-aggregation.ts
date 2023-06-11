import { useQuery } from '@tanstack/react-query'

import { aggregation } from '../../queries/definition/aggregation'

export const useAggregation = () => {
  return useQuery({
    ...aggregation.root(),
  })
}
