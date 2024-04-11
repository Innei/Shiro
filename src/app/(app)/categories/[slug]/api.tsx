import { cache } from 'react'

import { attachUAAndRealIp } from '~/lib/attach-ua'
import { apiClient } from '~/lib/request'
import { requestErrorHandler } from '~/lib/request.server'

export const getData = cache(async (params: { slug: string }) => {
  attachUAAndRealIp()
  return await apiClient.category
    .getCategoryByIdOrSlug(params.slug)
    .catch(requestErrorHandler)
})
