import { dehydrate } from '@tanstack/react-query'
import { headers } from 'next/dist/client/components/headers'
import type { PropsWithChildren } from 'react'

import { TimelineType } from '@mx-space/api-client'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { SearchFAB } from '~/components/modules/shared/SearchFAB'
import { REQUEST_QUERY } from '~/constants/system'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'

export const metadata = {
  title: '时间线',
}

export default async (props: PropsWithChildren) => {
  attachUAAndRealIp()
  const header = headers()
  const query = header.get(REQUEST_QUERY)

  const search = new URLSearchParams(query || '?')
  const year = search.get('year')
  const type = search.get('type') as 'post' | 'note'

  const nextType = {
    post: TimelineType.Post,
    note: TimelineType.Note,
  }[type]
  const queryClient = getQueryClient()
  await queryClient.fetchQuery({
    queryKey: ['timeline'],
    meta: { nextType, year },
    queryFn: async () => {
      return await apiClient.aggregate
        .getTimeline({
          type: nextType,
          year: +(year || 0) || undefined,
        })
        .then((res) => res.data)
    },
  })

  return (
    <QueryHydrate
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => {
          return query.queryKey[0] === 'timeline'
        },
      })}
    >
      {props.children}

      <SearchFAB />
    </QueryHydrate>
  )
}
