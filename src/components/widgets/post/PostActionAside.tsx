'use client'

import { m, useAnimationControls, useForceUpdate } from 'framer-motion'

import { IonThumbsup } from '~/components/icons/thumbs-up'
import { MotionButtonBase } from '~/components/ui/button'
import { useIsClient } from '~/hooks/common/use-is-client'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'
import { urlBuilder } from '~/lib/url-builder'
import {
  getCurrentPostData,
  setCurrentPostData,
  useCurrentPostDataSelector,
} from '~/providers/post/CurrentPostDataProvider'
import { useModalStack } from '~/providers/root/modal-stack-provider'
import { isLikedBefore, setLikeId } from '~/utils/cookie'
import { clsxm } from '~/utils/helper'
import { apiClient } from '~/utils/request'

import { ActionAsideContainer } from '../shared/ActionAsideContainer'
import { DonateButton } from '../shared/DonateButton'
import { ShareModal } from '../shared/ShareModal'

export const PostActionAside: Component = ({ className }) => {
  return (
    <ActionAsideContainer className={className}>
      <LikeButton />
      <ShareButton />
      <DonateButton />
    </ActionAsideContainer>
  )
}

const LikeButton = () => {
  const control = useAnimationControls()
  const [update] = useForceUpdate()

  const id = useCurrentPostDataSelector((data) => data?.id)

  if (!id) return null
  const handleLike = () => {
    if (isLikedBefore(id)) return

    apiClient.post.thumbsUp(id).then(() => {
      setLikeId(id)
      setCurrentPostData((draft) => {
        draft.count.like += 1
      })
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
            <m.i
              className="text-uk-orange-light"
              initial={{
                scale: 0.96,
              }}
              animate={{
                scale: 1.22,
              }}
            >
              <IonThumbsup />
            </m.i>
          ),
        })
      }}
    >
      <m.i
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
      </m.i>
    </MotionButtonBase>
  )
}

const ShareButton = () => {
  const isClient = useIsClient()
  const { present } = useModalStack()

  if (!isClient) return null

  return (
    <MotionButtonBase
      aria-label="Share This Post Button"
      className="flex flex-col space-y-2"
      onClick={() => {
        const post = getCurrentPostData()

        if (!post) return

        const hasShare = 'share' in navigator

        const title = '分享一片宝藏文章'
        const url = urlBuilder(
          routeBuilder(Routes.Post, {
            slug: post.slug,
            category: post.category.slug,
          }),
        ).href

        const text = `嘿，我发现了一片宝藏文章「${post.title}」哩，快来看看吧！${url}`

        if (hasShare)
          navigator.share({
            title: post.title,
            text: post.text,
            url,
          })
        else {
          present({
            title: '分享此内容',
            content: () => <ShareModal text={text} title={title} url={url} />,
          })
        }
      }}
    >
      <i className="icon-[mingcute--share-forward-fill] text-[24px] opacity-80 duration-200 hover:text-uk-cyan-light hover:opacity-100" />
    </MotionButtonBase>
  )
}
