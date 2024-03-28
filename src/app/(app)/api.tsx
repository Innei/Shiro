import { cache } from 'react'

import { attachUAAndRealIp } from '~/lib/attach-ua'
import { getQueryClient } from '~/lib/query-client.server'
import { queries } from '~/queries/definition'

export const fetchAggregationData = cache(async () => {
  const queryClient = getQueryClient()
  attachUAAndRealIp()

  return queryClient.fetchQuery(queries.aggregation.root())
})
