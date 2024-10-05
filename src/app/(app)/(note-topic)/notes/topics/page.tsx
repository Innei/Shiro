import Link from 'next/link'

import { TimelineList } from '~/components/ui/list/TimelineList'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'
import { routeBuilder, Routes } from '~/lib/route-builder'

export default definePrerenderPage()({
  fetcher: async () => (await apiClient.topic.getAll()).data,
  Component: ({ data }) => {
    return (
      <BottomToUpSoftScaleTransitionView>
        <header className="prose">
          <h1>专栏</h1>
        </header>

        <main className="mt-10 text-zinc-950/80 dark:text-zinc-50/80">
          <TimelineList>
            {data.map((item, i) => {
              const date = new Date(item.created)

              return (
                <BottomToUpTransitionView
                  lcpOptimization
                  key={item.id}
                  delay={700 + 50 * i}
                  as="li"
                  className="flex min-w-0 items-center justify-between leading-loose"
                >
                  <Link
                    href={routeBuilder(Routes.NoteTopic, {
                      slug: item.slug,
                    })}
                    className="min-w-0 truncate"
                  >
                    {item.name}
                  </Link>
                  <span>
                    {(date.getMonth() + 1).toString().padStart(2, '0')}/
                    {date.getDate().toString().padStart(2, '0')}/
                    {date.getFullYear()}
                  </span>
                </BottomToUpTransitionView>
              )
            })}
          </TimelineList>
        </main>
      </BottomToUpSoftScaleTransitionView>
    )
  },
})
