'use client'

import type { NoteTimelineItem as NoteTimelineItemData } from '@mx-space/api-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { TargetAndTransition } from 'motion/react'
import { AnimatePresence, m } from 'motion/react'
import { useLocale } from 'next-intl'
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
  const locale = useLocale()
  const note = useCurrentNoteDataSelector((data) => {
    const note = data?.data
    if (!note) return null
    return {
      id: note.id,
      nid: note.nid,
      title: note.title,
      created: note.created,
      isPublished: note.isPublished,
    }
  })
  const noteNid = useCurrentNoteNid()

  const noteId = note?.id

  const { data: timelineData } = useQuery({
    queryKey: ['note_timeline', noteId, locale],
    queryFn: async ({ queryKey }) => {
      const [, noteId, lang] = queryKey
      if (!noteId) throw ''
      const data = await apiClient.note.proxy.list(noteId).get<{
        data: NoteTimelineItemData[]
        size: number
      }>({
        params: { size: 10, lang },
      })
      return data.data
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
          isPublished: note.isPublished,
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
            />
          )
        })}
      </m.ul>
    </AnimatePresence>
  )
}
