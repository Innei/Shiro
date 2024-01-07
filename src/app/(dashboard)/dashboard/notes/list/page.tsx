'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import RemoveMarkdown from 'remove-markdown'
import type { NoteModel } from '@mx-space/api-client'
import type { CardProps } from '~/components/modules/dashboard/writing/CardMasonry'

import { MdiClockOutline } from '~/components/icons/clock'
import { PageLoading } from '~/components/layout/dashboard/PageLoading'
import {
  Card,
  CardMasonry,
} from '~/components/modules/dashboard/writing/CardMasonry'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { FloatPopover } from '~/components/ui/float-popover'
import { RelativeTime } from '~/components/ui/relative-time'
import { withQueryPager } from '~/hooks/biz/use-query-pager'
import { adminQueries } from '~/queries/definition'

export default withQueryPager(function Page() {
  const {
    data: result,
    isLoading,
    fetchNextPage,
    hasNextPage,
    // @ts-expect-error
  } = useInfiniteQuery({
    ...adminQueries.note.paginate(),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  })

  if (isLoading) return <PageLoading />

  const data = result?.pages.flatMap((page) => page.data) ?? []
  return (
    <div className="relative mt-8">
      <CardMasonry data={data}>
        {(data) => {
          return (
            <Card
              data={data}
              key={data.id}
              title={data.title}
              description={RemoveMarkdown(data.text)}
              slots={cardSlot}
            />
          )
        }}
      </CardMasonry>

      {hasNextPage && (
        <LoadMoreIndicator
          onLoading={() => {
            fetchNextPage()
          }}
        />
      )}
    </div>
  )
})

const cardSlot: CardProps<NoteModel>['slots'] = {
  footer(data) {
    if (!data) return null
    return (
      <div className="flex items-center gap-2">
        <MdiClockOutline />
        <RelativeTime date={data.created} />
        {data.modified && (
          <FloatPopover
            wrapperClassName="text-xs"
            as="span"
            type="tooltip"
            TriggerComponent={() => '(已编辑)'}
          >
            编辑于 <RelativeTime date={data.modified} />
          </FloatPopover>
        )}
        {data.topic && (
          <FloatPopover
            TriggerComponent={() => (
              <div className="flex items-center gap-1">
                <img
                  src={data.topic?.icon}
                  alt=""
                  className="h-5 w-5 rounded-full"
                />
                <div>{data.topic && data.topic.name}</div>
              </div>
            )}
          >
            <div className="flex flex-col gap-1">
              <div>专栏：{data.topic.name}</div>
            </div>
          </FloatPopover>
        )}
      </div>
    )
  },

  right(data) {
    if (!data) return null
    return (
      <>
        <Link
          className="absolute inset-0 bottom-8 z-[1]"
          href={`/dashboard/notes/edit?id=${data.id}`}
        />
      </>
    )
  },
}
