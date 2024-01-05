import { Chip, Select, SelectItem } from '@nextui-org/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { produce } from 'immer'

import { RelativeTime } from '~/components/ui/date-time'
import { FloatPopover } from '~/components/ui/float-popover'
import { EllipsisHorizontalTextWithTooltip } from '~/components/ui/typography'
import { useI18n } from '~/i18n/hooks'
import { trpc } from '~/lib/trpc'

import {
  usePostModelDataSelector,
  usePostModelSetModelData,
} from '../data-provider'

export const RelatedPostSelector = () => {
  const { isLoading, isFetching, data, fetchNextPage } =
    trpc.post.relatedList.useInfiniteQuery(
      {
        size: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )
  const t = useI18n()
  const relatedIds = usePostModelDataSelector((state) => state?.relatedIds)
  const currentId = usePostModelDataSelector((state) => state?.id)
  const setter = usePostModelSetModelData()
  const selection = useMemo(() => {
    return new Set(relatedIds)
  }, [relatedIds])

  const scrollerRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const $scroller = scrollerRef.current
    if (!$scroller) return
    $scroller.onscrollend = () => {
      fetchNextPage()
    }

    return () => {
      $scroller.onscrollend = null
    }
  }, [fetchNextPage, isOpen])

  const postMap = useMemo(() => {
    const map = new Map<string, { title: string }>()

    if (!data) return map

    data.pages.forEach((page) => {
      page.items.forEach((post) => {
        map.set(post.id, { title: post.title })
      })
    })

    return map
  }, [data])

  return (
    <Select
      label={t('module.posts.related_posts')}
      labelPlacement="outside"
      placeholder={t('module.posts.select_posts')}
      selectionMode="multiple"
      size="sm"
      scrollRef={scrollerRef}
      isLoading={isLoading || isFetching}
      onOpenChange={setIsOpen}
      selectedKeys={selection}
      renderValue={(items) => {
        const el = (
          <>
            {items.map((i) => {
              return (
                <Chip size="sm" className="max-w-full truncate" key={i.key}>
                  {postMap?.get(i.key as string)?.title}
                </Chip>
              )
            })}
          </>
        )

        return (
          <FloatPopover
            placement="top"
            TriggerComponent={() => <div className="flex gap-4">{el}</div>}
            type="tooltip"
            trigger="hover"
          >
            <div className="flex-grow">{el}</div>
          </FloatPopover>
        )
      }}
      onSelectionChange={(keys) => {
        setter((state) => {
          return produce(state, (draft) => {
            draft.relatedIds = [...new Set<string>(keys as any).values()]
          })
        })
      }}
    >
      {/* // FIXME: https://github.com/nextui-org/nextui/issues/1715 */}
      {/* @ts-expect-error */}
      {data?.pages.map((page) => {
        return page.items.map((post) => {
          if (post.id === currentId) return
          return (
            <SelectItem id={post.id} key={post.id}>
              <div className="flex items-center">
                <EllipsisHorizontalTextWithTooltip className="flex-grow">
                  {post.title}
                </EllipsisHorizontalTextWithTooltip>
                <span className="flex-shrink-0 text-xs opacity-80">
                  <RelativeTime time={post.created} />
                </span>
              </div>
            </SelectItem>
          )
        })
      })}
    </Select>
  )
}
