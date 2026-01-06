import { cache } from 'react'

import { attachServerFetch, getAuthFromCookie } from '~/lib/attach-fetch'
import { getQueryClient } from '~/lib/query-client.server'
import { requestErrorHandler } from '~/lib/request.server'
import { queries } from '~/queries/definition'

export const getData = cache(
  async (params: {
    id: string

    token?: string
    password?: string
  }) => {
    await attachServerFetch()

    const auth = await getAuthFromCookie()

    const { id, password, token } = params

    const query = queries.note.byNid(
      id,
      password,
      token ? `${token}` : undefined,
    )

    const data = await getQueryClient()
      .fetchQuery({
        ...query,
        staleTime: auth ? 0 : undefined,
      })
      .catch(requestErrorHandler)
    return data
  },
)
