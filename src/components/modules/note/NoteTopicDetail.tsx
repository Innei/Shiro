'use client'

import type { TopicModel } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import type { FC } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { MdiClockOutline } from '~/components/icons/clock'
import { MdiFountainPenTip } from '~/components/icons/pen'
import { Divider, DividerVertical } from '~/components/ui/divider'
import { Loading } from '~/components/ui/loading'
import { RelativeTime } from '~/components/ui/relative-time'
import { useIsClient } from '~/hooks/common/use-is-client'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

import { NoteTopicMarkdownRender } from './NoteTopicMarkdownRender'

export const NoteTopicDetail: FC<{ topic: TopicModel }> = (props) => {
  const { topic } = props
  const { id: topicId } = topic

  const { data, isLoading } = useQuery({
    queryKey: [`topic-${topicId}`],
    queryFn: () =>
      apiClient.note.getNoteByTopicId(topicId, 1, 1, {
        sortBy: 'created',
        sortOrder: -1,
      }),
  })

  const isMobile = useIsMobile()
  const isClient = useIsClient()
  if (!isClient) {
    return null
  }

  return (
    <div className="flex w-[400px] flex-col">
      <Link
        href={routeBuilder(Routes.NoteTopic, {
          slug: topic.slug,
        })}
      >
        <h1 className="!m-0 inline-block pb-2 text-lg font-medium">
          {topic.name}
        </h1>
        {isMobile && (
          <i className="i-mingcute-arrow-right-up-line ml-2 translate-y-[2px] opacity-70" />
        )}
      </Link>

      <div className="line-clamp-2 break-all text-neutral-content">
        <NoteTopicMarkdownRender>{topic.introduce}</NoteTopicMarkdownRender>
      </div>
      {topic.description && (
        <>
          <Divider />
          <div className="leading-8 opacity-90">
            <NoteTopicMarkdownRender>
              {topic.description}
            </NoteTopicMarkdownRender>
          </div>
        </>
      )}

      <Divider />
      {isLoading ? (
        <Loading className="my-4" />
      ) : (
        data?.data[0] && (
          <p className="flex items-center">
            <MdiClockOutline />
            <DividerVertical />
            <span className="shrink-0">最近更新</span>
            <DividerVertical />
            <span className="inline-flex min-w-0 shrink">
              <Link
                href={`/data?.data/${data?.data[0].nid}`}
                className="truncate"
              >
                {data?.data[0]?.title}
              </Link>
              <span className="shrink-0">
                （
                <RelativeTime
                  date={data?.data[0].modified || data?.data[0].created}
                  displayAbsoluteTimeAfterDay={Infinity}
                />
                ）
              </span>
            </span>
          </p>
        )
      )}

      {!isLoading && (
        <>
          <Divider />
          <p className="flex items-center">
            <MdiFountainPenTip />
            <DividerVertical />
            共有文章：
            {data?.pagination?.total} 篇
          </p>
        </>
      )}
    </div>
  )
}

export const ToTopicLink: FC = () => {
  const topic = useCurrentNoteDataSelector((data) => data?.data.topic)
  if (!topic) return null
  return (
    <Link
      href={routeBuilder(Routes.NoteTopic, {
        slug: topic.slug,
      })}
    >
      <span className="grow truncate opacity-80 hover:opacity-100">
        {topic.name}
      </span>
    </Link>
  )
}
