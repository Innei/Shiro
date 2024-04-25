/* eslint-disable react/display-name */
import { dehydrate } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

import { TimelineType } from '@mx-space/api-client'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { SearchFAB } from '~/components/modules/shared/SearchFAB'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

export const metadata = {
  title: '时间线',
}
export const dynamic = 'force-dynamic'

export default definePrerenderPage<{
  type: string
  year: string
}>()({
  async fetcher({ type, year }) {
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
  },
  Component: async (props: PropsWithChildren) => {
    const queryClient = getQueryClient()
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
  },
})
