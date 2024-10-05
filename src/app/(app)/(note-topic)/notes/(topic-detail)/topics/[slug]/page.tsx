'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { TimelineList } from '~/components/ui/list/TimelineList'
import { Loading } from '~/components/ui/loading'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'

import { getTopicQuery } from './query'

export default function Page() {
  const { slug } = useParams()
  const { data } = useQuery({
    ...getTopicQuery(slug as string),
    enabled: false,
  })

  const {
    data: notes,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['topicId', data?.id],

    enabled: !!data,
    queryFn: async ({ queryKey, pageParam }) => {
      const [, topicId] = queryKey
      if (!topicId) throw new Error('topicId is not ready :(')
      return await apiClient.note.getNoteByTopicId(topicId, pageParam)
    },
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  })
  if (!data) throw new Error('topic data is lost :(')
  const { name } = data

  if (isLoading) return <Loading useDefaultLoadingText />
  return (
    <BottomToUpSoftScaleTransitionView>
      <header className="prose">
        <h1>专栏 - {name}</h1>
      </header>

      <main className="mt-10 text-zinc-950/80 dark:text-zinc-50/80">
        <TimelineList>
          {notes?.pages.map((page) =>
            page.data.map((child, i) => {
              const date = new Date(child.created)

              return (
                <BottomToUpTransitionView
                  key={child.id}
                  delay={700 + 50 * i}
                  as="li"
                  className="flex min-w-0 items-center justify-between leading-loose"
                >
                  <Link
                    href={routeBuilder(Routes.Note, {
                      id: child.nid,
                    })}
                    className="min-w-0 truncate"
                  >
                    {child.title}
                  </Link>
                  <span>
                    {(date.getMonth() + 1).toString().padStart(2, '0')}/
                    {date.getDate().toString().padStart(2, '0')}/
                    {date.getFullYear()}
                  </span>
                </BottomToUpTransitionView>
              )
            }),
          )}

          {hasNextPage && <LoadMoreIndicator onLoading={fetchNextPage} />}
        </TimelineList>
      </main>
    </BottomToUpSoftScaleTransitionView>
  )
}
