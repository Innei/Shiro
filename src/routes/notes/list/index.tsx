import type { NoteModel } from '@mx-space/api-client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import RemoveMarkdown from 'remove-markdown'

import { MdiClockOutline } from '~/components/icons/clock'
import { PageLoading } from '~/components/layout/dashboard/PageLoading'
import { OffsetHeaderLayout } from '~/components/modules/dashboard/layouts'
import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'
import type { CardProps } from '~/components/modules/dashboard/writing/CardMasonry'
import {
  Card,
  CardMasonry,
} from '~/components/modules/dashboard/writing/CardMasonry'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { RoundedIconButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { RelativeTime } from '~/components/ui/relative-time'
import { adminQueries } from '~/queries/definition'

export const Component = function Page() {
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

  const navigation = useNavigate()
  if (isLoading) return <PageLoading />

  const data = result?.pages.flatMap((page) => page.data) ?? []
  return (
    <div className="relative mt-8">
      <CardMasonry data={data}>
        {(data) => (
          <Card
            data={data}
            key={data.id}
            title={data.title}
            description={RemoveMarkdown(data.text)}
            slots={cardSlot}
          />
        )}
      </CardMasonry>

      {hasNextPage && (
        <LoadMoreIndicator
          onLoading={() => {
            fetchNextPage()
          }}
        />
      )}

      <OffsetHeaderLayout>
        <RoundedIconButton
          onClick={() => {
            navigation('/dashboard/notes/edit')
          }}
          className="card-shadow"
        >
          <i className="i-mingcute-add-line text-white" />
        </RoundedIconButton>
      </OffsetHeaderLayout>
    </div>
  )
}

const cardSlot: CardProps<NoteModel>['slots'] = {
  footer(data) {
    if (!data) return null
    return (
      <div className="flex items-center gap-2">
        <MdiClockOutline />
        <RelativeTime date={data.created} />
        {data.modified && (
          <FloatPopover
            mobileAsSheet
            wrapperClassName="text-xs"
            as="span"
            type="tooltip"
            triggerElement="(已编辑)"
          >
            编辑于 <RelativeTime date={data.modified} />
          </FloatPopover>
        )}
        {data.topic && (
          <FloatPopover
            mobileAsSheet
            triggerElement={
              <div className="flex items-center gap-1">
                <img
                  src={data.topic?.icon}
                  alt=""
                  className="size-5 rounded-full"
                />
                <div>{data.topic && data.topic.name}</div>
              </div>
            }
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
          to={`/dashboard/notes/edit?id=${data.id}`}
        />
      </>
    )
  },
}

export const config = defineRouteConfig({
  title: '列表',
  icon: <i className="i-mingcute-pen-line" />,
  priority: 1,
})
