'use client'

import type { TimelineData } from '@mx-space/api-client'
import { TimelineType } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { m } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { memo, useEffect } from 'react'

import { SolidBookmark } from '~/components/icons/bookmark'
import { NormalContainer } from '~/components/layout/container/Normal'
import { PeekLink } from '~/components/modules/peek/PeekLink'
import { TimelineProgress } from '~/components/modules/timeline/TimelineProgress'
import { Divider } from '~/components/ui/divider'
import { BackToTopFAB } from '~/components/ui/fab'
import { TimelineList } from '~/components/ui/list/TimelineList'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'
import { apiClient } from '~/lib/request'
import { springScrollToElement } from '~/lib/scroller'

enum ArticleType {
  Post,
  Note,
}
type MapType = {
  title: string
  meta: string[]
  date: Date
  href: string

  type: ArticleType
  id: string
  important?: boolean
}

const useJumpTo = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const jumpToId = new URLSearchParams(location.search).get('selectId')

      if (!jumpToId) return

      const target = document.querySelector(
        `[data-id="${jumpToId}"]`,
      ) as HTMLElement

      if (!target) return

      springScrollToElement(target, -500).then(() => {
        target.animate(
          [
            {
              backgroundColor: 'hsl(var(--a) / 50)',
            },
            {
              backgroundColor: 'transparent',
            },
          ],
          {
            duration: 1500,
            easing: 'ease-in-out',
            fill: 'both',
            iterations: 1,
          },
        )
      })

      // wait for user focus
    }, 100)

    return () => clearTimeout(timer)
  }, [])
}

export default function TimelinePage() {
  const search = useSearchParams()

  const year = search.get('year')
  const type = search.get('type') as 'post' | 'note'
  const nextType = {
    post: TimelineType.Post,
    note: TimelineType.Note,
  }[type]

  const { data: initialData } = useQuery<TimelineData>({
    queryKey: ['timeline'],
    enabled: false,
  })
  const { data, refetch } = useQuery<TimelineData>({
    queryKey: ['timeline', nextType, year],
    initialData,
    queryFn: async ({ queryKey }) => {
      const [, nextType, year] = queryKey as [string, TimelineType, string]
      return await apiClient.aggregate
        .getTimeline({
          type: nextType,
          year: +(year || 0) || undefined,
        })
        .then((res) => res.data)
    },
  })

  useEffect(() => {
    refetch()
  }, [nextType])

  useJumpTo()

  if (!data) return null

  const memory = search.get('bookmark') || search.get('memory')

  const title = !memory ? '时间线' : '回忆'

  const { posts = [], notes = [] } = data
  const sortedMap = new Map<number, MapType[]>()

  if (!memory) {
    posts.forEach((post) => {
      const date = new Date(post.created)
      const year = date.getFullYear()
      const data: MapType = {
        title: post.title,
        meta: [post.category.name, '博文'],
        date,
        href: `/posts/${post.category.slug}/${post.slug}`,

        type: ArticleType.Post,
        id: post.id,
      }
      sortedMap.set(
        year,
        sortedMap.get(year) ? sortedMap.get(year)!.concat(data) : [data],
      )
    })
  }

  notes
    .filter((n) => (memory ? n.bookmark : true))
    .forEach((note) => {
      const date = new Date(note.created)
      const year = date.getFullYear()
      const data: MapType = {
        title: note.title,
        meta: [
          note.mood ? `心情：${note.mood}` : undefined,
          note.weather ? `天气：${note.weather}` : undefined,
          '手记',
        ].filter(Boolean) as string[],
        date,
        href: `/notes/${note.nid}`,

        type: ArticleType.Note,
        id: note.id,
        important: note.bookmark,
      }

      sortedMap.set(
        year,
        sortedMap.get(year) ? sortedMap.get(year)!.concat(data) : [data],
      )
    })

  sortedMap.forEach((val, key) => {
    sortedMap.set(
      key,
      val.sort((a, b) => b.date.getTime() - a.date.getTime()),
    )
  })

  const sortedArr = Array.from(sortedMap)

  const subtitle = `共有 ${
    sortedArr.flat(2).filter((i) => typeof i === 'object').length
  } 篇文章，${!memory ? '再接再厉' : '回顾一下从前吧'}`

  return (
    <NormalContainer>
      <header className="prose prose-p:my-2">
        <h1>{title}</h1>
        <h3>{subtitle}</h3>

        {!memory && (
          <>
            <Divider className="my-8 w-[80px]" />
            <TimelineProgress />
            <p>活在当下，珍惜眼下</p>
          </>
        )}
      </header>

      <main className="mt-10 text-zinc-950/80 dark:text-zinc-50/80" key={type}>
        {sortedArr.reverse().map(([year, value]) => {
          return (
            <BottomToUpSoftScaleTransitionView key={year} className="my-4">
              <m.h4
                className={clsx(
                  'relative mb-4 ml-3 text-lg font-medium',
                  'rounded-md before:absolute before:inset-y-[4px] before:-left-3 before:w-[2px] before:bg-accent before:content-auto',
                )}
              >
                {year}
                <small className="ml-2">({value.length})</small>
              </m.h4>
              <TimelineList>
                {value.map((item) => {
                  return <Item item={item} key={item.id} />
                })}
              </TimelineList>
            </BottomToUpSoftScaleTransitionView>
          )
        })}
      </main>
      <BackToTopFAB />
    </NormalContainer>
  )
}

const Item = memo<{
  item: MapType
}>(({ item }) => {
  const router = useRouter()

  return (
    <li
      key={item.id}
      className="flex items-center justify-between"
      data-id={item.id}
    >
      <span className="flex min-w-0 shrink items-center">
        <span className="mr-2 inline-block w-12 tabular-nums">
          {Intl.DateTimeFormat('en-us', {
            month: '2-digit',
            day: '2-digit',
          }).format(item.date)}
        </span>
        <PeekLink href={item.href} className="min-w-0 truncate leading-6">
          <span className="min-w-0 truncate">{item.title}</span>
        </PeekLink>
        {item.important && (
          <SolidBookmark
            className="ml-2 cursor-pointer text-red-500"
            onClick={() => {
              const url = new URL(window.location.href)
              url.searchParams.set('memory', 'true')
              router.push(url.href)
            }}
          />
        )}
      </span>
      <span className="hidden text-sm lg:inline">
        {item.meta.map((m, i) => (i === 0 ? m : `/${m}`))}
      </span>
    </li>
  )
})
Item.displayName = 'Item'
