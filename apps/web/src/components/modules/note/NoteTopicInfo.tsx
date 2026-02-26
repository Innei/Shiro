'use client'

import type { NoteTopicListItem, PaginateResult } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import type { FC } from 'react'
import { memo, useMemo } from 'react'

import { Divider } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { apiClient } from '~/lib/request'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

import { NoteTimelineItem } from './NoteTimelineItem'
import { NoteTopicDetail, ToTopicLink } from './NoteTopicDetail'

export const NoteTopicInfo = memo(() => {
  const t = useTranslations('note')
  const topic = useCurrentNoteDataSelector((data) => data?.data.topic)

  if (!topic) return null

  return (
    <>
      <Divider className="w-3/4!" />
      <p className="mb-1 flex min-w-0 flex-col overflow-hidden text-neutral/50">
        {t('article_in_topic')}
      </p>

      <FloatPopover
        placement="right"
        strategy="fixed"
        wrapperClassName="flex flex-grow shrink min-w-0"
        TriggerComponent={ToTopicLink}
      >
        <NoteTopicDetail topic={topic} />
      </FloatPopover>
      {topic.id && <NoteTopicRank topicId={topic.id} />}
    </>
  )
})

NoteTopicInfo.displayName = 'NoteTopicInfo'

const NoteTopicRank: FC<{
  topicId: string
}> = ({ topicId }) => {
  const t = useTranslations('note')
  const locale = useLocale()
  const noteId = useCurrentNoteDataSelector((data) => data?.data.id)
  const { data: topicNotes } = useQuery({
    queryKey: [`topic-${topicId}`, locale],
    refetchOnMount: true,
    queryFn: () =>
      apiClient.note.proxy
        .topics(topicId)
        .get<PaginateResult<NoteTopicListItem>>({
          params: {
            page: 1,
            size: 6,
            sortBy: 'created',
            sortOrder: -1,
            lang: locale,
          },
        }),
  })

  const filteredNotes = useMemo(() => {
    if (!topicNotes) return null
    const { data: notes } = topicNotes
    return notes.filter((item) => item.id !== noteId).slice(0, 5)
  }, [noteId, topicNotes])

  return (
    <>
      {!!filteredNotes?.length && (
        <>
          <Divider />
          <p className="mb-1 flex min-w-0 flex-col overflow-hidden text-neutral/50">
            {t('topic_other_articles')}
          </p>

          <ul className="space-y-1 opacity-80">
            {filteredNotes.map((item) => (
              <NoteTimelineItem
                active={false}
                title={item.title}
                nid={item.nid}
                key={item.id}
              />
            ))}
          </ul>
        </>
      )}
    </>
  )
}
