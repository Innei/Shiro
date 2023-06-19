'use client'

import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { tv } from 'tailwind-variants'

import { LeftToRightTransitionView } from '~/components/ui/transition/LeftToRightTransitionView'
import { useNoteData } from '~/hooks/data/use-note'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { clsxm } from '~/utils/helper'
import { apiClient } from '~/utils/request'

export const NoteTimeline = () => {
  const note = useNoteData()
  const noteId = note?.id
  // const [parent, enableAnimations] = useAutoAnimate<HTMLUListElement>()
  const { data: timelineData } = useQuery(
    ['notetimeline', noteId],
    async ({ queryKey }) => {
      const [, noteId] = queryKey
      if (!noteId) throw ''
      return (await apiClient.note.getMiddleList(noteId, 10)).$serialized.data
    },
    {
      enabled: noteId !== undefined,
      keepPreviousData: true,
    },
  )

  if (!noteId) return null

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
      <ul className="space-y-1">
        {(timelineData || initialData)?.map((item) => {
          const isCurrent = item.id === noteId
          return (
            <MemoedItem
              key={item.id}
              active={isCurrent}
              title={item.title}
              nid={item.nid}
            />
          )
        })}
      </ul>
    </AnimatePresence>
  )
}

const styles = tv({
  base: 'text-neutral-content min-w-0 truncate text-left opacity-50 w-[10rem] transition-all tabular-nums hover:opacity-80',
  variants: {
    status: {
      active: 'ml-2 opacity-100',
    },
  },
})

const MemoedItem = memo<{
  active: boolean
  title: string
  nid: number
}>((props) => {
  const { active, nid, title } = props

  return (
    <motion.li
      layout
      className="flex items-center [&_i]:hover:text-accent"
      layoutId={`note-${nid}`}
    >
      <LeftToRightTransitionView
        in={active}
        as="span"
        className="inline-flex items-center"
      >
        <i className="icon-[material-symbols--arrow-circle-right-outline-rounded] duration-200" />
      </LeftToRightTransitionView>
      <Link
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
    </motion.li>
  )
})
