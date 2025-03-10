import { attachServerFetch } from '~/lib/attach-fetch'
import { apiClient } from '~/lib/request'
import { requestErrorHandler } from '~/lib/request.server'

export const getData = async (params: { slug: string }) => {
  await attachServerFetch()
  return await apiClient.category
    .getCategoryByIdOrSlug(params.slug)
    .catch(requestErrorHandler)
}
