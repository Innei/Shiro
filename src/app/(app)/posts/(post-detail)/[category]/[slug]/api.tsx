import { cache } from 'react'

import { attachUAAndRealIp } from '~/lib/attach-ua'
import { getQueryClient } from '~/lib/query-client.server'
import { requestErrorHandler } from '~/lib/request.server'
import { queries } from '~/queries/definition'

export interface PageParams {
  category: string
  slug: string
}
export const getData = cache(async (params: PageParams) => {
  const { category, slug } = params
  attachUAAndRealIp()
  const data = await getQueryClient()
    .fetchQuery(queries.post.bySlug(category, slug))
    .catch(requestErrorHandler)
  return data
})
