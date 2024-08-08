import Link from 'next/link'

import { NormalContainer } from '~/components/layout/container/Normal'
import { TimelineList } from '~/components/ui/list/TimelineList'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'
import { routeBuilder, Routes } from '~/lib/route-builder'

export default definePrerenderPage<{
  name: string
}>()({
  async fetcher({ name }) {
    const res = await apiClient.category.getTagByName(name)
    return res.data
  },
  Component({ data, params: { name } }) {
    return (
      <NormalContainer>
        <h1 className="mb-16 mt-8 text-3xl font-medium">
          标签： {name} ({data.length})
        </h1>
        <TimelineList>
          {data
            .sort(
              (a, b) =>
                new Date(b.created).getTime() - new Date(a.created).getTime(),
            )
            .map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between"
                data-id={item.id}
              >
                <span className="flex min-w-0 shrink items-center">
                  <span className="mr-2 inline-block tabular-nums">
                    {Intl.DateTimeFormat('en-us', {
                      month: '2-digit',
                      day: '2-digit',
                      year: '2-digit',
                    }).format(new Date(item.created))}
                  </span>
                  <Link
                    href={routeBuilder(Routes.Post, {
                      category: item.category.slug,
                      slug: item.slug,
                    })}
                    className="min-w-0 truncate leading-6"
                  >
                    <span className="min-w-0 truncate">{item.title}</span>
                  </Link>
                </span>
              </li>
            ))}
        </TimelineList>
      </NormalContainer>
    )
  },
})
