'use client'

import { useQuery } from '@tanstack/react-query'
import { memo, useMemo } from 'react'
import type { FC } from 'react'

import { Divider } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { apiClient } from '~/lib/request'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

import { NoteTimelineItem } from './NoteTimelineItem'
import { NoteTopicDetail, ToTopicLink } from './NoteTopicDetail'

export const NoteTopicInfo = memo(() => {
  const topic = useCurrentNoteDataSelector((data) => data?.data.topic)

  if (!topic) return null

  return (
    <>
      <Divider className="!w-3/4" />
      <p className="mb-1 flex min-w-0 flex-col overflow-hidden text-neutral-content/50">
        此文章收录于专栏：
      </p>

      <FloatPopover
        placement="right"
        strategy="fixed"
        wrapperClassName="flex flex-grow flex-shrink min-w-0"
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
  const noteId = useCurrentNoteDataSelector((data) => data?.data.id)
  const { data: topicNotes } = useQuery({
    queryKey: [`topic-${topicId}`],
    refetchOnMount: true,
    queryFn: () =>
      apiClient.note.getNoteByTopicId(topicId, 1, 6, {
        sortBy: 'created',
        sortOrder: -1,
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
          <p className="mb-1 flex min-w-0 flex-col overflow-hidden text-neutral-content/50">
            此专栏的其他文章：
          </p>

          <ul className="space-y-1 opacity-80">
            {filteredNotes.map((item) => {
              return (
                <NoteTimelineItem
                  attachToken={item.hide}
                  active={false}
                  title={item.title}
                  nid={item.nid}
                  key={item.id}
                />
              )
            })}
          </ul>
        </>
      )}
    </>
  )
}
