'use client'

import { useQueryClient } from '@tanstack/react-query'
import { motion, useAnimationControls, useForceUpdate } from 'framer-motion'
import { produce } from 'immer'
import type { NoteWrappedPayload } from '@mx-space/api-client'

import { IonThumbsup } from '~/components/icons/thumbs-up'
import { MotionButtonBase } from '~/components/ui/button'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useCurrentPostData } from '~/hooks/data/use-post'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'
import { urlBuilder } from '~/lib/url-builder'
import { getCurrentNoteData } from '~/providers/note/CurrentNodeDataProvider'
import { useCurrentNoteId } from '~/providers/note/CurrentNoteIdProvider'
import { useAggregationData } from '~/providers/root/aggregation-data-provider'
import { queries } from '~/queries/definition'
import { isLikedBefore, setLikeId } from '~/utils/cookie'
import { clsxm } from '~/utils/helper'
import { apiClient } from '~/utils/request'

import { DonateButton } from '../shared/DonateButton'

export const PostActionAside: Component = ({ className }) => {
  return (
    <div
      className={clsxm(
        'absolute bottom-0 left-0 max-h-[300px] flex-col space-y-8',
        className,
      )}
    >
      <LikeButton />
      <ShareButton />
      <DonateButton />
    </div>
  )
}

const LikeButton = () => {
  const post = useCurrentPostData()

  const queryClient = useQueryClient()
  const control = useAnimationControls()
  const [update] = useForceUpdate()
  if (!post) return null
  const id = post.id
  const handleLike = () => {
    if (isLikedBefore(id)) return
    apiClient.note.likeIt(id).then(() => {
      setLikeId(id)
      queryClient.setQueriesData(
        queries.post.bySlug(post.category.slug, post.slug),
        (old: any) => {
          return produce(old as NoteWrappedPayload, (draft) => {
            draft.data.count.like += 1
          })
        },
      )
      update()
    })
  }

  const isLiked = isLikedBefore(id)

  return (
    <MotionButtonBase
      aria-label="Like this post"
      className="flex flex-col space-y-2"
      onClick={() => {
        handleLike()
        control.start('tap', {
          repeat: 5,
        })
        toast('捕捉一只大佬！', undefined, {
          iconElement: (
            <motion.i
              className="text-uk-orange-light"
              initial={{
                scale: 0.96,
              }}
              animate={{
                scale: 1.22,
              }}
            >
              <IonThumbsup />
            </motion.i>
          ),
        })
      }}
    >
      <motion.i
        className={clsxm(
          'text-[24px] opacity-80 duration-200 hover:text-uk-orange-light hover:opacity-100',

          isLiked && 'text-uk-orange-dark',
        )}
        animate={control}
        variants={{
          tap: {
            scale: 1.3,
          },
        }}
        transition={{
          easings: ['easeInOut'],
        }}
      >
        <IonThumbsup />
      </motion.i>
    </MotionButtonBase>
  )
}

const ShareButton = () => {
  const hasShare = 'share' in navigator
  const isClient = useIsClient()
  void useCurrentNoteId()
  const note = getCurrentNoteData()?.data
  const aggregation = useAggregationData()
  if (!isClient) return null
  if (!note) return null

  if (!hasShare) {
    return null
  }
  if (!aggregation) return null
  return (
    <MotionButtonBase
      aria-label="Share this post"
      className="flex flex-col space-y-2"
      onClick={() => {
        navigator.share({
          title: note.title,
          text: note.text,
          url: urlBuilder(
            routeBuilder(Routes.Note, {
              id: note.nid.toString(),
            }),
          ).href,
        })
      }}
    >
      <i className="icon-[mingcute--share-forward-fill] text-[24px] opacity-80 duration-200 hover:text-uk-cyan-light hover:opacity-100" />
    </MotionButtonBase>
  )
}
