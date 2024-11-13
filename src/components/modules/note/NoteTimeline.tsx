'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { TargetAndTransition } from 'motion/react'
import { AnimatePresence, m } from 'motion/react'
import { memo } from 'react'

import { apiClient } from '~/lib/request'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'
import { useCurrentNoteNid } from '~/providers/note/CurrentNoteIdProvider'

import { NoteTimelineItem } from './NoteTimelineItem'

export const NoteTimeline = memo(() => {
  const noteId = useCurrentNoteNid()
  if (!noteId) return null
  return <NoteTimelineImpl />
})
NoteTimeline.displayName = 'NoteTimeline'

const animateUl: TargetAndTransition = {
  transition: {
    staggerChildren: 0.5,
  },
}
const NoteTimelineImpl = () => {
  const note = useCurrentNoteDataSelector((data) => {
    const note = data?.data
    if (!note) return null
    return {
      id: note.id,
      nid: note.nid,
      title: note.title,
      created: note.created,
      hide: note.hide,
    }
  })
  const noteNid = useCurrentNoteNid()

  const noteId = note?.id

  const { data: timelineData } = useQuery({
    queryKey: ['note_timeline', noteId],
    queryFn: async ({ queryKey }) => {
      const [, noteId] = queryKey
      if (!noteId) throw ''
      return (await apiClient.note.getMiddleList(noteId, 10)).$serialized.data
    },
    enabled: noteId !== undefined,
    placeholderData: keepPreviousData,
  })

  const initialData = note
    ? [
        {
          title: note.title,
          nid: note.nid,
          id: note.id,
          created: note.created,
          hide: note.hide,
        },
      ]
    : []

  return (
    <AnimatePresence>
      <m.ul className="space-y-1 [&_i]:hover:text-accent" animate={animateUl}>
        {(timelineData || initialData)?.map((item) => {
          const isCurrent = item.nid === Number.parseInt(noteNid || '0')
          return (
            <NoteTimelineItem
              layout
              key={item.id}
              active={isCurrent}
              title={item.title}
              nid={item.nid}
              attachToken={item.hide}
            />
          )
        })}
      </m.ul>
    </AnimatePresence>
  )
}
