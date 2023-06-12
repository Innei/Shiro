'use client'

import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import type { TopicModel } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import type { FC } from 'react'

import { MdiClockOutline } from '~/components/icons/clock'
import { MdiFountainPenTip } from '~/components/icons/pen'
import { Divider, DividerVertical } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { Loading } from '~/components/ui/loading'
import { RelativeTime } from '~/components/ui/relative-time'
import { useNoteData } from '~/hooks/data/use-note'
import { apiClient } from '~/utils/request'

export const NoteTopicInfo = () => {
  const note = useNoteData()

  if (!note?.topic) return null

  return (
    <>
      <Divider className="!w-3/4" />
      <p className="mb-1 flex min-w-0 flex-col overflow-hidden text-neutral-content/50">
        此文章收录于专栏：
      </p>

      <FloatPopover
        placement="right"
        strategy="fixed"
        wrapperClassNames="flex flex-grow flex-shrink min-w-0"
        TriggerComponent={ToTopicLink}
      >
        <InnerTopicDetail topic={note.topic} />
      </FloatPopover>
    </>
  )
}

const InnerTopicDetail: FC<{ topic: TopicModel }> = (props) => {
  const { topic } = props
  const { id: topicId } = topic

  const { data, isLoading } = useQuery([`topic-${topicId}`], () =>
    apiClient.note.getNoteByTopicId(topicId, 1, 1, {
      sortBy: 'created',
      sortOrder: -1,
    }),
  )

  return (
    <div className="flex w-[400px] flex-col">
      <Link href={`/notes/topics/${topic.slug}`}>
        <h1 className="!m-0 inline-block pb-2 text-lg font-medium">
          {topic.name}
        </h1>
      </Link>

      <p className="line-clamp-2 break-all text-neutral-content">
        <NoteTopicMarkdownRender>{topic.introduce}</NoteTopicMarkdownRender>
      </p>
      {topic.description && (
        <>
          <Divider />
          <p className="text-gray-1 leading-8">
            <NoteTopicMarkdownRender>
              {topic.description}
            </NoteTopicMarkdownRender>
          </p>
        </>
      )}

      <Divider />
      {isLoading ? (
        <Loading />
      ) : (
        data?.data[0] && (
          <p className="flex items-center">
            <MdiClockOutline />
            <DividerVertical />
            <span className="flex-shrink-0">最近更新</span>
            <DividerVertical />
            <span className="inline-flex min-w-0 flex-shrink">
              <Link
                href={`/data?.data/${data?.data[0].nid}`}
                className="truncate"
              >
                {data?.data[0]?.title}
              </Link>
              <span className="flex-shrink-0">
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

const mdOptions: MarkdownToJSX.Options = {
  allowedTypes: [
    'text',
    'paragraph',
    'codeInline',
    'link',
    'linkMailtoDetector',
    'linkBareUrlDetector',
    'linkAngleBraceStyleDetector',
    'textStrikethroughed',
    'textEmphasized',
    'textBolded',
    'textEscaped',
  ],
  forceBlock: true,
  wrapper: ({ children }) => <div className="leading-7">{children}</div>,
}
export const NoteTopicMarkdownRender: FC<{ children: string }> = memo(
  (props) => {
    return <Markdown options={mdOptions}>{props.children}</Markdown>
  },
)

const ToTopicLink: FC = () => {
  const note = useNoteData()
  if (!note?.topic) return null
  return (
    <Link href={`/notes/topics/${note?.topic?.slug}`}>
      <span className="flex-grow truncate opacity-80 hover:opacity-100">
        {note?.topic?.name}
      </span>
    </Link>
  )
}
