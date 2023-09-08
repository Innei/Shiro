'use client'

import { useQuery } from '@tanstack/react-query'
import { memo, useCallback } from 'react'
import Link from 'next/link'
import type { TagModel } from '@mx-space/api-client'

import { EmptyIcon } from '~/components/icons/empty'
import { FABPortable } from '~/components/ui/fab'
import { TimelineList } from '~/components/ui/list/TimelineList'
import { Loading } from '~/components/ui/loading'
import { Tag } from '~/components/ui/tag/Tag'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { useModalStack } from '~/providers/root/modal-stack-provider'

export const PostTagsFAB = () => {
  const { present } = useModalStack()
  return (
    <FABPortable
      onClick={() => {
        present({
          content: TagsModal,
          title: '标签云',
        })
      }}
    >
      <i className="icon-[mingcute--hashtag-line]" />
    </FABPortable>
  )
}

const TagsModal = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      return (await apiClient.category.getAllTags()).data
    },
  })

  const { present } = useModalStack()
  const handleTagClick = useCallback((tag: TagModel) => {
    present({
      content: () => <TagDetailModal {...tag} />,
      title: `Tag: ${tag.name}`,
    })
  }, [])
  if (isLoading) return <Loading />
  if (!data) return <EmptyIcon />
  return (
    <div className="flex flex-wrap gap-3">
      {data.map((tag) => {
        return <TagInternal key={tag.name} {...tag} onClick={handleTagClick} />
      })}
    </div>
  )
}

const TagInternal = memo(function TagInternal(
  props: TagModel & {
    onClick?: (tag: TagModel) => void
  },
) {
  const { count, name } = props

  return (
    // @ts-ignore
    <Tag count={count} text={name} onClick={props.onClick} passProps={props} />
  )
})

export const TagDetailModal = (props: { name: string }) => {
  const { name } = props
  const { data, isLoading } = useQuery({
    queryKey: [name, 'tag'],
    queryFn: async ({ queryKey }) => {
      const [tagName] = queryKey
      return (await apiClient.category.getTagByName(tagName)).data
    },
    staleTime: 1000 * 60 * 60 * 24,
  })
  const { dismissAll } = useModalStack()
  if (isLoading) return <div className="h-30 loading-dots flex w-full center" />

  if (!data) return <EmptyIcon />

  return (
    <TimelineList>
      {data.map((item) => {
        return (
          <li
            key={item.id}
            className="flex items-center justify-between"
            data-id={item.id}
          >
            <span className="flex min-w-0 flex-shrink items-center">
              <span className="mr-2 inline-block w-12 tabular-nums">
                {Intl.DateTimeFormat('en-us', {
                  month: '2-digit',
                  day: '2-digit',
                }).format(new Date(item.created))}
              </span>
              <Link
                onClick={() => {
                  dismissAll()
                }}
                prefetch={false}
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
        )
      })}
    </TimelineList>
  )
}
