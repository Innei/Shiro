'use client'

import { m, useAnimationControls } from 'motion/react'
import { useTranslations } from 'next-intl'

import { useIsMobile } from '~/atoms/hooks/viewport'
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
} from '../shared/ActionAsideContainer'
import { ArticleRightAside } from '../shared/ArticleRightAside'
import { AsideCommentButton } from '../shared/AsideCommentButton'
import { AsideDonateButton } from '../shared/AsideDonateButton'
import { ShareModal } from '../shared/ShareModal'
import { asideButtonStyles } from '../shared/styles'
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

export const PostActionAside: Component = ({ className }) => (
  <ArticleRightAside>
    <ActionAsideContainer className={className}>
      <LikeButton />
      <ShareButton />
      <SubscribeButton />
      <AsideDonateButton />
      <PostAsideCommentButton />
    </ActionAsideContainer>
  </ArticleRightAside>
)

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
    useCurrentPostDataSelector((data) => ({
      title: data?.title,
      id: data?.id,
      allowComment: data?.allowComment,
    })) || {}
  const isEof = useIsEoFWrappedElement()
  if (!id) return null
  if (isEof) return null
  if (!allowComment) return null

  return <AsideCommentButton refId={id} title={title!} />
}

const LikeButton = () => {
  const t = useTranslations('common')
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
      aria-label={t('aria_like_post')}
      className="flex flex-col space-y-2"
      onClick={() => {
        handleLike()
        control.start('tap')
        toast.success(t('like_post'), {
          iconElement: (
            <m.i
              className="text-warning"
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
          'relative flex hover:text-warning hover:opacity-100',
          asideButtonStyles.base,

          isLiked && 'text-warning',
        )}
        animate={control}
        variants={{
          tap: {
            scale: 1.3,
          },
        }}
        transition={{
          ease: 'easeInOut',
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
  const t = useTranslations('common')
  const isClient = useIsClient()
  const { present } = useModalStack()

  if (!isClient) return null

  return (
    <MotionButtonBase
      aria-label={t('aria_share_post')}
      className="flex flex-col space-y-2"
      onClick={() => {
        const post = getGlobalCurrentPostData()

        if (!post) return

        const hasShare = 'share' in navigator

        const title = t('share_treasure')
        const url = urlBuilder(
          routeBuilder(Routes.Post, {
            slug: post.slug,
            category: post.category.slug,
          }),
        ).href

        const text = t('share_message', { title: post.title })

        if (hasShare)
          navigator.share({
            title: post.title,
            text: post.text,
            url,
          })
        else {
          present({
            title: t('share_content'),
            clickOutsideToDismiss: true,
            content: () => <ShareModal text={text} title={title} url={url} />,
          })
        }
      }}
    >
      <ActionAsideIcon className="i-mingcute-share-forward-line hover:text-info" />
    </MotionButtonBase>
  )
}
