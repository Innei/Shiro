'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import type { TargetAndTransition } from 'framer-motion'

import { apiClient } from '~/lib/request.new'
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
        },
      ]
    : []

  return (
    <AnimatePresence>
      <m.ul className="space-y-1 [&_i]:hover:text-accent" animate={animateUl}>
        {(timelineData || initialData)?.map((item) => {
          const isCurrent = item.nid === parseInt(noteNid || '0')
          return (
            <NoteTimelineItem
              layout
              key={item.id}
              active={isCurrent}
              title={item.title}
              nid={item.nid}
            />
          )
        })}
      </m.ul>
    </AnimatePresence>
  )
}
