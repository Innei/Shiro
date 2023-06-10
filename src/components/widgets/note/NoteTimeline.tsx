'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import Link from 'next/link'

import { MaterialSymbolsArrowCircleRightOutlineRounded } from '~/components/icons/MaterialSymbolsArrowCircleRightOutlineRounded'
import { LeftToRightTransitionView } from '~/components/ui/transition/LeftToRightTransitionView'
import { useNoteData } from '~/hooks/biz/use-note'
import { apiClient } from '~/utils/request'

export const NoteTimeline = () => {
  const note = useNoteData()
  const noteId = note?.id
  const [animationParent] = useAutoAnimate<HTMLUListElement>()
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

  if (!noteId || !note) return null

  const initialData = [
    {
      title: note.title,
      nid: note.nid,
      id: note.id,
      created: note.created,
    },
  ]

  return (
    <ul ref={animationParent}>
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
  )
}
const MemoedItem = memo<{
  active: boolean
  title: string
  nid: number
}>((props) => {
  const { active, nid, title } = props

  return (
    <li className="flex items-center">
      <LeftToRightTransitionView in={active} as="span">
        <MaterialSymbolsArrowCircleRightOutlineRounded className="text-secondary" />
      </LeftToRightTransitionView>
      <Link
        // className={clsx(active ? styles['active'] : null, styles.item)}
        href={`/notes/${nid}`}
        scroll={false}
      >
        {title}
      </Link>
    </li>
  )
})
