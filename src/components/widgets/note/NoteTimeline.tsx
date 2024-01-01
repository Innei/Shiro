'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Link from 'next/link'
import { tv } from 'tailwind-variants'
import type { Target, TargetAndTransition } from 'framer-motion'

import { LeftToRightTransitionView } from '~/components/ui/transition/LeftToRightTransitionView'
import { clsxm } from '~/lib/helper'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { springScrollToTop } from '~/lib/scroller'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'
import { useCurrentNoteNid } from '~/providers/note/CurrentNoteIdProvider'

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
            <MemoedItem
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

const styles = tv({
  base: 'text-neutral-content min-w-0 truncate text-left opacity-50 transition-all tabular-nums hover:opacity-80',
  variants: {
    status: {
      active: 'ml-2 opacity-100',
    },
  },
})

const initialLi: Target = {
  opacity: 0.0001,
}
const animateLi: TargetAndTransition = {
  opacity: 1,
}

const MemoedItem = memo<{
  active: boolean
  title: string
  nid: number
}>((props) => {
  const { active, nid, title } = props

  return (
    <m.li
      layout
      className="flex items-center"
      layoutId={`note-${nid}`}
      initial={initialLi}
      animate={animateLi}
      exit={initialLi}
    >
      {active && (
        <LeftToRightTransitionView
          as="span"
          className="inline-flex items-center"
        >
          <i className="icon-[material-symbols--arrow-circle-right-outline-rounded] duration-200" />
        </LeftToRightTransitionView>
      )}
      <Link
        onClick={springScrollToTop}
        prefetch={false}
        className={clsxm(
          active
            ? styles({
                status: 'active',
              })
            : styles(),
        )}
        href={routeBuilder(Routes.Note, {
          id: nid,
        })}
        scroll={false}
      >
        {title}
      </Link>
    </m.li>
  )
})

MemoedItem.displayName = 'MemoedItem'
