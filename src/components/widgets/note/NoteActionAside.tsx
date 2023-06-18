'use client'

import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { produce } from 'immer'
import type { NoteWrappedPayload } from '@mx-space/api-client'

import { MotionButtonBase } from '~/components/ui/button'
import { microReboundPreset } from '~/constants/spring'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useNoteData } from '~/hooks/data/use-note'
import { toast } from '~/lib/toast'
import { urlBuilder } from '~/lib/url-builder'
import { useAggregationData } from '~/providers/root/aggregation-data-provider'
import { queries } from '~/queries/definition'
import { clsxm } from '~/utils/helper'
import { apiClient } from '~/utils/request'

export const NoteActionAside: Component = ({ className }) => {
  return (
    <div
      className={clsxm(
        'absolute bottom-0 max-h-[300px] flex-col space-y-4',
        className,
      )}
    >
      <LikeButton />
      <ShareButton />
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

const ShareButton = () => {
  const hasShare = 'share' in navigator
  const isClient = useIsClient()
  const note = useNoteData()
  const aggregation = useAggregationData()
  if (!isClient) return null
  if (!note) return null

  if (!hasShare) {
    return null
  }
  if (!aggregation) return null
  return (
    <MotionButtonBase
      className="flex flex-col space-y-2"
      onClick={() => {
        navigator.share({
          title: note.title,
          text: note.text,
          url: urlBuilder(`/notes/${note.nid}`).href,
        })
      }}
    >
      <i className="icon-[mingcute--share-forward-fill] text-[24px] opacity-80 duration-200 hover:text-uk-cyan-light hover:opacity-100" />
    </MotionButtonBase>
  )
}
