'use client'

import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { produce } from 'immer'
import type { NoteWrappedPayload } from '@mx-space/api-client'

import { MotionButtonBase } from '~/components/ui/button'
import { microReboundPreset } from '~/constants/spring'
import { useNoteData } from '~/hooks/data/use-note'
import { toast } from '~/lib/toast'
import { queries } from '~/queries/definition'
import { apiClient } from '~/utils/request'

export const NoteActionAside = () => {
  return (
    <div className="absolute bottom-0 max-h-[300px] flex-col space-y-4">
      <LikeButton />
    </div>
  )
}

const LikeButton = () => {
  const note = useNoteData()

  const queryClient = useQueryClient()
  if (!note) return null
  const id = note.id
  const handleLike = () => {
    apiClient.note.likeIt(id).then(() => {
      queryClient.setQueriesData(
        queries.note.byNid(note.nid.toString()),
        (old: any) => {
          return produce(old as NoteWrappedPayload, (draft) => {
            draft.data.count.like += 1
          })
        },
      )
    })
  }
  return (
    <MotionButtonBase
      className="flex flex-col space-y-2"
      onClick={() => {
        handleLike()
        toast('谢谢你！', undefined, {
          iconElement: (
            <motion.i
              className="icon-[mingcute--heart-fill] text-uk-red-light"
              initial={{
                scale: 0.96,
              }}
              animate={{
                scale: 1.12,
              }}
              transition={{
                ...microReboundPreset,
                delay: 1,
                repeat: 5,
              }}
            />
          ),
        })
      }}
    >
      <i className="icon-[mingcute--heart-fill] text-[24px] opacity-80 duration-200 hover:text-uk-red-light hover:opacity-100" />
    </MotionButtonBase>
  )
}
