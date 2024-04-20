import { cache } from 'react'
import { headers } from 'next/dist/client/components/headers'

import { REQUEST_QUERY } from '~/constants/system'
import { attachServerFetch, getAuthFromCookie } from '~/lib/attach-fetch'
import { getQueryClient } from '~/lib/query-client.server'
import { requestErrorHandler } from '~/lib/request.server'
import { queries } from '~/queries/definition'

export const getData = cache(async (params: { id: string }) => {
  attachServerFetch()

  const header = headers()
  const searchParams = new URLSearchParams(header.get(REQUEST_QUERY) || '')
  const id = params.id
  const token = searchParams.get('token')
  const query = queries.note.byNid(
    id,
    searchParams.get('password') || undefined,
    token ? `${token}` : undefined,
  )

  const data = await getQueryClient()
    .fetchQuery({
      ...query,
      staleTime: getAuthFromCookie() ? 0 : undefined,
    })
    .catch(requestErrorHandler)
  return data
})
