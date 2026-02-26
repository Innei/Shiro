import { cache } from 'react'

import { attachServerFetch } from '~/lib/attach-fetch'
import { apiClient } from '~/lib/request'
import { requestErrorHandler } from '~/lib/request.server'

export interface PageParams extends LocaleParams {
  slug: string
}

export const getData = cache(async (slug: string) => {
  await attachServerFetch()
  const data = await apiClient.page
    .getBySlug(slug, )
    .catch(requestErrorHandler)
  return data.$serialized
})
