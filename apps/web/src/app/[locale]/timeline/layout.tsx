import { TimelineType } from '@mx-space/api-client'
import { dehydrate } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { PropsWithChildren } from 'react'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { SearchFAB } from '~/components/modules/shared/SearchFAB'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

export const generateMetadata = async (
  props: NextPageParams<{ locale: string }>,
): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({
    namespace: 'common',
    locale,
  })
  return {
    title: t('page_title_timeline'),
  }
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
      queryKey: ['timeline', nextType, year],
      queryFn: async () =>
        await apiClient.aggregate
          .getTimeline({
            type: nextType,
            year: +(year || 0) || undefined,
          })
          .then((res) => res.data),
    })
  },
  Component: async (props: PropsWithChildren) => {
    const queryClient = getQueryClient()
    return (
      <QueryHydrate
        state={dehydrate(queryClient, {
          shouldDehydrateQuery: (query) => query.queryKey[0] === 'timeline',
        })}
      >
        {props.children}

        <SearchFAB />
      </QueryHydrate>
    )
  },
})
