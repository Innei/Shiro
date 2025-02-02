'use client'

import { m, useAnimationControls } from 'motion/react'

import { useIsMobile } from '~/atoms/hooks'
import { MotionButtonBase } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import { useForceUpdate } from '~/hooks/common/use-force-update'
import { useIsClient } from '~/hooks/common/use-is-client'
import { isLikedBefore, setLikeId } from '~/lib/cookie'
import { clsxm } from '~/lib/helper'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'
import { urlBuilder } from '~/lib/url-builder'
import {
  getCurrentNoteData,
  setCurrentNoteData,
  useCurrentNoteDataSelector,
} from '~/providers/note/CurrentNoteDataProvider'
import { useCurrentNoteNid } from '~/providers/note/CurrentNoteIdProvider'
import { useIsEoFWrappedElement } from '~/providers/shared/WrappedElementProvider'

import {
  ActionAsideContainer,
  ActionAsideIcon,
  asideButtonStyles,
} from '../shared/ActionAsideContainer'
import { AsideCommentButton } from '../shared/AsideCommentButton'
import { AsideDonateButton } from '../shared/AsideDonateButton'
import { ShareModal } from '../shared/ShareModal'
import { usePresentSubscribeModal } from '../subscribe'

export const NoteBottomBarAction: Component = () => {
  const isMobile = useIsMobile()
  if (!isMobile) return null
  return (
    <div className="mb-8 mt-4 flex items-center justify-center space-x-8">
      <LikeButton />
      <ShareButton />
      <SubscribeButton />
      <AsideDonateButton />
    </div>
  )
}

export const NoteActionAside: Component = ({ className }) => {
  return (
    <ActionAsideContainer className={className}>
      <LikeButton />
      <ShareButton />
      <SubscribeButton />
      <NoteAsideCommentButton />
      <AsideDonateButton />
    </ActionAsideContainer>
  )
}

const NoteAsideCommentButton = () => {
  const { title, id, allowComment } =
    useCurrentNoteDataSelector((_data) => {
      const { data } = _data || {}
      return {
        title: data?.title,
        id: data?.id,
        allowComment: data?.allowComment,
      }
    }) || {}

  const isEoF = useIsEoFWrappedElement()
  if (!id) return null
  if (isEoF) return null
  if (!allowComment) return null
  return <AsideCommentButton refId={id} title={title!} />
}

const LikeButton = () => {
  const control = useAnimationControls()
  const [update] = useForceUpdate()

  const likeCount = useCurrentNoteDataSelector((data) => data?.data.count.like)
  const id = useCurrentNoteDataSelector((data) => data?.data.id)
  const nid = useCurrentNoteNid()

  if (!id) return null

  const handleLike = () => {
    if (isLikedBefore(id)) return
    if (!nid) return
    apiClient.activity.likeIt('Note', id).then(() => {
      setLikeId(id)
      setCurrentNoteData((draft) => {
        draft.data.count.like += 1
      })
      update()
    })
  }

  const isLiked = isLikedBefore(id)

  return (
    <MotionButtonBase
      aria-label="Like This Note Button"
      className="relative flex flex-col space-y-2"
      onClick={() => {
        handleLike()
        control.start('tap', {
          repeat: 5,
        })
        toast.success('谢谢你！', {
          iconElement: (
            <m.i
              className="i-mingcute-heart-fill text-uk-red-light"
              initial={{
                scale: 0.96,
              }}
              animate={{
                scale: 1.22,
              }}
              transition={{
                easings: ['easeInOut'],
                delay: 0.3,
                repeat: 5,
                repeatDelay: 0.3,
              }}
            />
          ),
        })
      }}
    >
      <m.i
        className={clsxm(
          'duration-200 hover:text-uk-red-light',
          asideButtonStyles.base,
          !isLiked && 'i-mingcute-heart-line',
          isLiked && 'i-mingcute-heart-fill text-uk-red-light',
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
      />
      {!!likeCount && (
        <span className="absolute bottom-0 right-0 translate-x-[10px] text-[10px]">
          <NumberSmoothTransition>{likeCount}</NumberSmoothTransition>
        </span>
      )}
    </MotionButtonBase>
  )
}

const SubscribeButton = () => {
  const { present } = usePresentSubscribeModal(['note_c'])
  return (
    <MotionButtonBase className="flex flex-col space-y-2" onClick={present}>
      <ActionAsideIcon className="i-material-symbols-notifications-active-outline hover:text-accent" />
    </MotionButtonBase>
  )
}

const ShareButton = () => {
  const isClient = useIsClient()
  const { present } = useModalStack()

  if (!isClient) return null

  return (
    <MotionButtonBase
      aria-label="Share This Note Button"
      className="flex flex-col space-y-2"
      onClick={() => {
        const note = getCurrentNoteData()?.data

        if (!note) return

        const hasShare = 'share' in navigator

        const title = '分享一片宝藏文章'
        const url = urlBuilder(
          routeBuilder(Routes.Note, {
            id: note.nid.toString(),
          }),
        ).href

        const text = `嘿，我发现了一片宝藏文章「${note.title}」哩，快来看看吧！`

        if (hasShare)
          navigator.share({
            title: note.title,
            text: note.text,
            url,
          })
        else {
          present({
            title: '分享此内容',
            clickOutsideToDismiss: true,
            content: () => <ShareModal text={text} title={title} url={url} />,
          })
        }
      }}
    >
      <ActionAsideIcon className="i-mingcute-share-forward-line hover:text-uk-cyan-light" />
    </MotionButtonBase>
  )
}
