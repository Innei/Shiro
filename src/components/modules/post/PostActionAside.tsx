'use client'

import { m, useAnimationControls } from 'motion/react'

import { useIsMobile } from '~/atoms/hooks'
import { ThumbsupIcon } from '~/components/icons/thumbs-up'
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
  getGlobalCurrentPostData,
  setGlobalCurrentPostData,
  useCurrentPostDataSelector,
} from '~/providers/post/CurrentPostDataProvider'
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

export const PostBottomBarAction: Component = () => {
  const isMobile = useIsMobile()
  if (!isMobile) return null
  return (
    <div className="my-6 flex items-center justify-center space-x-8">
      <LikeButton />
      <ShareButton />
      <SubscribeButton />
      <AsideDonateButton />
    </div>
  )
}

export const PostActionAside: Component = ({ className }) => {
  return (
    <ActionAsideContainer className={className}>
      <LikeButton />
      <ShareButton />
      <SubscribeButton />
      <AsideDonateButton />
      <PostAsideCommentButton />
    </ActionAsideContainer>
  )
}

const SubscribeButton = () => {
  const { present } = usePresentSubscribeModal(['post_c'])
  return (
    <MotionButtonBase className="flex flex-col space-y-2" onClick={present}>
      <ActionAsideIcon className="i-material-symbols-notifications-active-outline hover:text-accent" />
    </MotionButtonBase>
  )
}

const PostAsideCommentButton = () => {
  const { title, id, allowComment } =
    useCurrentPostDataSelector((data) => {
      return {
        title: data?.title,
        id: data?.id,
        allowComment: data?.allowComment,
      }
    }) || {}
  const isEof = useIsEoFWrappedElement()
  if (!id) return null
  if (isEof) return null
  if (!allowComment) return null

  return <AsideCommentButton refId={id} title={title!} />
}

const LikeButton = () => {
  const control = useAnimationControls()
  const [update] = useForceUpdate()

  const id = useCurrentPostDataSelector((data) => data?.id)
  const likeCount = useCurrentPostDataSelector((data) => data?.count.like)

  if (!id) return null
  const handleLike = () => {
    if (isLikedBefore(id)) return

    apiClient.activity.likeIt('Post', id).then(() => {
      setLikeId(id)
      setGlobalCurrentPostData((draft) => {
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
        control.start('tap')
        toast.success('捕捉一只大佬！', {
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
              <ThumbsupIcon />
            </m.i>
          ),
        })
      }}
    >
      <m.i
        className={clsxm(
          'relative flex hover:text-uk-orange-light hover:opacity-100',
          asideButtonStyles.base,

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
        <ThumbsupIcon />
        {!!likeCount && (
          <span className="absolute bottom-0 right-0 translate-x-[8px] text-[10px]">
            <NumberSmoothTransition>{likeCount}</NumberSmoothTransition>
          </span>
        )}
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
        const post = getGlobalCurrentPostData()

        if (!post) return

        const hasShare = 'share' in navigator

        const title = '分享一片宝藏文章'
        const url = urlBuilder(
          routeBuilder(Routes.Post, {
            slug: post.slug,
            category: post.category.slug,
          }),
        ).href

        const text = `嘿，我发现了一片宝藏文章「${post.title}」哩，快来看看吧！`

        if (hasShare)
          navigator.share({
            title: post.title,
            text: post.text,
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
