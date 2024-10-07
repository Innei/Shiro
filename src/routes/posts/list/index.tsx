import type { PostModel } from '@mx-space/api-client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import RemoveMarkdown from 'remove-markdown'

import { MdiClockOutline } from '~/components/icons/clock'
import { FeHash } from '~/components/icons/fa-hash'
import { PageLoading } from '~/components/layout/dashboard/PageLoading'
import { OffsetHeaderLayout } from '~/components/modules/dashboard/layouts'
import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'
import type { CardProps } from '~/components/modules/dashboard/writing/CardMasonry'
import {
  Card,
  CardMasonry,
} from '~/components/modules/dashboard/writing/CardMasonry'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { PhPushPinFill } from '~/components/modules/shared/PinIconToggle'
import { RoundedIconButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { RelativeTime } from '~/components/ui/relative-time'
import { Tag } from '~/components/ui/tag/Tag'
import { adminQueries } from '~/queries/definition'

export const config = defineRouteConfig({
  priority: 1,
  title: '列表',
  icon: <i className="i-mingcute-list-collapse-line" />,
})
export function Component() {
  const {
    data: result,
    isLoading,
    fetchNextPage,
    hasNextPage,
    // @ts-expect-error
  } = useInfiniteQuery({
    ...adminQueries.post.paginate(),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  })

  const navigate = useNavigate()
  if (isLoading) return <PageLoading />

  const data = result?.pages.flatMap((page) => page.data) ?? []
  return (
    <div className="relative mt-8">
      <CardMasonry data={data}>
        {(data) => {
          const isPin = !!data?.pin
          return (
            <Card
              className={
                isPin ? '!ring-1 !ring-yellow-400 dark:!ring-orange-600' : ''
              }
              data={data}
              key={data.id}
              title={data.title}
              description={RemoveMarkdown(data.summary || data.text)}
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

      <OffsetHeaderLayout>
        <RoundedIconButton
          onClick={() => {
            navigate('/dashboard/posts/edit')
          }}
          className="card-shadow"
        >
          <i className="i-mingcute-add-line text-white" />
        </RoundedIconButton>
      </OffsetHeaderLayout>
    </div>
  )
}

const cardSlot: CardProps<PostModel>['slots'] = {
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
        <FloatPopover
          mobileAsSheet
          triggerElement={
            <div className="flex items-center gap-2">
              <FeHash className="translate-y-[0.5px]" />
              <div>{data.category.name}</div>
            </div>
          }
        >
          <div className="flex flex-col gap-1">
            <div>分类：{data.category.name}</div>
            {data.tags.length > 0 && (
              <div className="flex items-center">
                <span>标签：</span>
                <div className="flex gap-2">
                  {data.tags.map((tag) => (
                    <Tag className="px-2 py-1" text={tag} key={tag} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </FloatPopover>
      </div>
    )
  },

  right(data) {
    if (!data) return null
    return (
      <>
        {!!data.pin && (
          <div className="absolute -right-3 -top-3 rounded-full border border-current bg-red-200/80 p-1 text-red-500 dark:bg-red-500/30 dark:text-red-400">
            <PhPushPinFill />
          </div>
        )}
        <Link
          className="absolute inset-0 bottom-8 z-[1]"
          to={`/dashboard/posts/edit?id=${data.id}`}
        />
      </>
    )
  },
}
