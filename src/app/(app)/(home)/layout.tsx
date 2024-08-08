import { dehydrate } from '@tanstack/react-query'

import { QueryHydrate } from '~/components/common/QueryHydrate'
import { isShallowEqualArray } from '~/lib/lodash'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'
import { definePrerenderPage, requestErrorHandler } from '~/lib/request.server'

import { ActivityScreen } from './components/ActivityScreen'
import { Hero } from './components/Hero'
import { HomePageTimeLine } from './components/HomePageTimeLine'
import { Windsock } from './components/Windsock'
import { queryKey } from './query'

export const dynamic = 'force-dynamic'

export default definePrerenderPage()({
  fetcher() {
    const queryClient = getQueryClient()
    return queryClient
      .fetchQuery({
        queryKey,
        queryFn: async () => (await apiClient.aggregate.getTop(5)).$serialized,
      })
      .catch(requestErrorHandler)
  },
  async Component(props) {
    const queryClient = getQueryClient()

    const dehydrateState = dehydrate(queryClient, {
      shouldDehydrateQuery(query) {
        return isShallowEqualArray(query.queryKey as any, queryKey)
      },
    })

    return (
      <QueryHydrate state={dehydrateState}>
        <Hero />
        <ActivityScreen />
        <HomePageTimeLine />
        <Windsock />
        {props.children}
      </QueryHydrate>
    )
  },
})
