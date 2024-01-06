'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import RemoveMarkdown from 'remove-markdown'
import type { PostModel } from '@mx-space/api-client'
import type { CardProps } from '~/components/modules/dashboard/writing/CardMasonry'

import { MdiClockOutline } from '~/components/icons/clock'
import { FeHash } from '~/components/icons/fa-hash'
import {
  Card,
  CardMasonry,
} from '~/components/modules/dashboard/writing/CardMasonry'
import { FloatPopover } from '~/components/ui/float-popover'
import { RelativeTime } from '~/components/ui/relative-time'
import { AbsoluteCenterSpinner } from '~/components/ui/spinner'
import { Tag } from '~/components/ui/tag/Tag'
import { useQueryPager, withQueryPager } from '~/hooks/biz/use-query-pager'
import { adminQueries } from '~/queries/definition'

export default withQueryPager(function Page() {
  const [page] = useQueryPager()

  // getQueryClientForDashboard()
  const { data: result, isLoading } = useQuery(adminQueries.post.paginate(page))
  if (isLoading) return <AbsoluteCenterSpinner />
  const { data, pagination } = result || {}

  if (!data) return 'error'
  return (
    <div className="relative">
      <CardMasonry data={data}>
        {(data) => {
          return (
            <Card
              data={data}
              key={data.id}
              title={data.title}
              description={RemoveMarkdown(data.summary || data.text)}
              slots={cardSlot}
            />
          )
        }}
      </CardMasonry>
    </div>
  )
})

const cardSlot: CardProps<PostModel>['slots'] = {
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
        <FloatPopover
          TriggerComponent={() => (
            <div className="flex items-center gap-2">
              <FeHash className="translate-y-[0.5px]" />
              <div>{data.category.name}</div>
            </div>
          )}
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
        <Link
          className="absolute inset-0 bottom-8 z-[1]"
          href={`/dashboard/posts/edit?id=${data.id}`}
        />
      </>
    )
  },
}
