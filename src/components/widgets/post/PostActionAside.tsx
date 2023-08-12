'use client'

import { m, useAnimationControls, useForceUpdate } from 'framer-motion'

import { ThumbsupIcon } from '~/components/icons/thumbs-up'
import { MotionButtonBase } from '~/components/ui/button'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
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
import { useModalStack } from '~/providers/root/modal-stack-provider'

import { ActionAsideContainer } from '../shared/ActionAsideContainer'
import { AsideCommentButton } from '../shared/AsideCommentButton'
import { AsideDonateButton } from '../shared/AsideDonateButton'
import { ShareModal } from '../shared/ShareModal'

export const PostActionAside: Component = ({ className }) => {
  return (
    <ActionAsideContainer className={className}>
      <LikeButton />
      <ShareButton />

      <AsideDonateButton />
      <PostAsideCommentButton />
    </ActionAsideContainer>
  )
}

const PostAsideCommentButton = () => {
  const { title, id } =
    useCurrentPostDataSelector((data) => {
      return {
        title: data?.title,
        id: data?.id,
      }
    }) || {}
  if (!id) return null
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
              <ThumbsupIcon />
            </m.i>
          ),
        })
      }}
    >
      <m.i
        className={clsxm(
          'relative text-[24px] opacity-80 duration-200 hover:text-uk-orange-light hover:opacity-100',

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
          <span className="absolute bottom-[5px] right-0 translate-x-[8px] transform text-[10px]">
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
      <i className="icon-[mingcute--share-forward-line] text-[24px] opacity-80 duration-200 hover:text-uk-cyan-light hover:opacity-100" />
    </MotionButtonBase>
  )
}
