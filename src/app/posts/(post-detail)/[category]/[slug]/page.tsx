'use client'

import { useEffect } from 'react'
import { Balancer } from 'react-wrap-balancer'

import { ClientOnly } from '~/components/common/ClientOnly'
import { PostActionAside } from '~/components/widgets/post/PostActionAside'
import { PostCopyright } from '~/components/widgets/post/PostCopyright'
import { PostOutdate } from '~/components/widgets/post/PostOutdate'
import { PostRelated } from '~/components/widgets/post/PostRelated'
import { ArticleRightAside } from '~/components/widgets/shared/ArticleRightAside'
import { ReadIndicatorForMobile } from '~/components/widgets/shared/ReadIndicator'
import { SubscribeBell } from '~/components/widgets/subscribe/SubscribeBell'
import { XLogInfoForPost, XLogSummaryForPost } from '~/components/widgets/xlog'
import { springScrollToTop } from '~/lib/scroller'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import Loading from './loading'
import {
  HeaderMetaInfoSetting,
  PostMarkdown,
  PostMarkdownImageRecordProvider,
  PostMetaBarInternal,
} from './pageExtra'

const PostPage = () => {
  const id = useCurrentPostDataSelector((p) => p?.id)
  const title = useCurrentPostDataSelector((p) => p?.title)

  useEffect(() => {
    springScrollToTop()
  }, [id])

  if (!id) {
    return <Loading />
  }

  return (
    <div className="relative w-full min-w-0">
      <HeaderMetaInfoSetting />
      <article className="prose">
        <header className="mb-8">
          <h1 className="text-center">
            <Balancer>{title}</Balancer>
          </h1>

          <PostMetaBarInternal className="mb-8 justify-center" />

          <XLogSummaryForPost />

          <PostOutdate />
        </header>
        <WrappedElementProvider>
          <ReadIndicatorForMobile />
          <PostMarkdownImageRecordProvider>
            <PostMarkdown />
          </PostMarkdownImageRecordProvider>

          <LayoutRightSidePortal>
            <ArticleRightAside>
              <PostActionAside />
            </ArticleRightAside>
          </LayoutRightSidePortal>
        </WrappedElementProvider>
      </article>

      <ClientOnly>
        <PostRelated />
        <PostCopyright />
        <SubscribeBell defaultType="post_c" />
        <XLogInfoForPost />
      </ClientOnly>
    </div>
  )
}

export default PostPage
