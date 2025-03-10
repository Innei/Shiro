import { attachServerFetch, getAuthFromCookie } from '~/lib/attach-fetch'
import { getQueryClient } from '~/lib/query-client.server'
import { requestErrorHandler } from '~/lib/request.server'
import { queries } from '~/queries/definition'

export const getData = async (params: {
  id: string

  token?: string
  password?: string
}) => {
  await attachServerFetch()

  const { id, password, token } = params

  const query = queries.note.byNid(id, password, token ? `${token}` : undefined)

  const data = await getQueryClient()
    .fetchQuery({
      ...query,
      staleTime: (await getAuthFromCookie()) ? 0 : undefined,
    })
    .catch(requestErrorHandler)
  return data
}
